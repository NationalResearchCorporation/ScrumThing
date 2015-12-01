CREATE PROCEDURE [dbo].[GetPersonalActionLog]
    @UserIdentity VARCHAR(40),
    @FromTime DATETIME,         
    @ToTime DATETIME,           
    @TimeScale VARCHAR(6)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE UserIdentity = @UserIdentity)
    BEGIN
        ;THROW 50000, 'The user''s identity was not found in the database.', 1;
    END;

    IF @TimeScale NOT IN ('sprint', 'week', 'day', 'hour', 'minute', 'none')
    BEGIN
        ;THROW 50000, 'The supplied time scale is invalid.', 1;
    END;

    WITH UserAssignments AS (
        SELECT
            a.TaskId
        FROM
            Assignments a
            JOIN Users u ON a.UserName = u.UserName
        WHERE
            u.UserIdentity = @UserIdentity
    ),
    OrderedLog AS (
        SELECT
            LogOrdinal = ROW_NUMBER() OVER(PARTITION BY wl.TaskId ORDER BY wl.WorkLogId ASC),
            LogRecency = ROW_NUMBER() OVER(PARTITION BY wl.TaskId, dbo.GetTimeScaleWindowValue(@TimeScale, wl.SprintId, @FromTime, wl.[Timestamp])
                                      ORDER BY wl.WorkLogId DESC),
            wl.SprintId,
            wl.TaskId,
            wl.LoggedBy,
            wl.[Timestamp],
            TimeWindow = dbo.GetTimeScaleWindowValue(@TimeScale, wl.SprintId, @FromTime, wl.[Timestamp]),
            wl.TaskDevHoursBurned,  
            wl.TaskQsHoursBurned, 
            wl.TaskRemainingDevHours,
            wl.TaskRemainingQsHours  
        FROM
            WorkLogs wl
            JOIN UserAssignments ua ON wl.TaskId = ua.TaskId
    ),
    LogDeltas AS (
        SELECT
            ol.TaskId,
            ol.SprintId,
            ol.LoggedBy,
            MostRecentTimeStamp = MAX(ol.[Timestamp]),
            TaskDevHoursBurnedDelta = SUM(ol.TaskDevHoursBurned - COALESCE(ol_previous.TaskDevHoursBurned, ol.TaskDevHoursBurned)),
            TaskQsHoursBurnedDelta = SUM(ol.TaskQsHoursBurned - COALESCE(ol_previous.TaskQsHoursBurned, ol.TaskQsHoursBurned)),
            TaskRemainingDevHoursDelta = SUM(ol.TaskRemainingDevHours - COALESCE(ol_previous.TaskRemainingDevHours, ol.TaskRemainingDevHours)),
            TaskRemainingQsHoursDelta = SUM(ol.TaskRemainingQsHours - COALESCE(ol_previous.TaskRemainingQsHours, ol.TaskRemainingQsHours))
        FROM
            OrderedLog ol
            LEFT JOIN OrderedLog ol_previous ON
                 (ol_previous.TaskId = ol.TaskId AND ol_previous.logOrdinal = ol.logOrdinal - 1)
              OR (ol_previous.TaskId = NULL)
            JOIN Tasks t ON
                t.TaskId = ol.TaskId
        GROUP BY
            ol.TaskId,
            ol.SprintId,
            ol.LoggedBy,
            ol.TimeWindow
    ),
    MostRecentEntryWithinTimeWindow AS (
        SELECT
            ol.TaskId,
            ol.[Timestamp],
            ol.TaskDevHoursBurned,  
            ol.TaskQsHoursBurned, 
            ol.TaskRemainingDevHours,
            ol.TaskRemainingQsHours  
        FROM
            OrderedLog ol
        WHERE
            ol.LogRecency = 1
    )
    SELECT
        MostRecentActivityLoggedBy = ld.LoggedBy,
        ld.MostRecentTimeStamp,
        MinMax.MinTimeperiodValue,
        MinMax.MaxTimeperiodValue,
        te.TeamName,
        ld.SprintId,
        SprintName = sp.Name,
        StoryOrdinal = st.Ordinal,
		st.Title as StoryTitle,
        st.StoryText,
        st.IsReachGoal,
        st.StoryPoints,
        TaskOrdinal = t.Ordinal,
        t.TaskText,
        TaskState = t.[State],
        CAST(t.EstimatedDevHours AS DECIMAL(9, 4)),
        CAST(t.EstimatedQsHours AS DECIMAL(9, 4)),
        BurnedDevHours = m.TaskDevHoursBurned,
        BurnedDevHoursDelta = ld.TaskDevHoursBurnedDelta,
        BurnedQsHours = m.TaskQsHoursBurned,
        BurnedQsHoursDelta = ld.TaskQsHoursBurnedDelta,
        RemainingDevHours = m.TaskRemainingDevHours,
        RemaininDevHoursDelta = ld.TaskRemainingDevHoursDelta,
        RemainingQsHours = m.TaskRemainingQsHours,
        RemainingQsHoursDelta = ld.TaskRemainingQsHoursDelta
    FROM
        LogDeltas ld
        JOIN MostRecentEntryWithinTimeWindow m ON m.TaskId = ld.TaskId
            AND m.[Timestamp] = ld.MostRecentTimeStamp
        JOIN Sprints sp ON sp.SprintId = ld.SprintId
        JOIN Tasks t ON t.TaskId = ld.TaskId
        JOIN Stories st ON st.SprintId = sp.SprintId
            AND st.StoryId = t.StoryId
        JOIN Teams te ON sp.TeamId = te.TeamId
        CROSS APPLY dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, ld.MostRecentTimeStamp, ld.SprintId)
            AS MinMax
    WHERE
        ld.MostRecentTimeStamp BETWEEN @FromTime AND @ToTime
    ORDER BY
        MinMax.MinTimeperiodValue DESC,
        te.TeamName ASC,
        sp.Name DESC,
        sp.SprintId DESC,
        st.Ordinal ASC,
        t.Ordinal ASC
END;