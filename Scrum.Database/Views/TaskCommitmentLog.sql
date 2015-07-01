CREATE VIEW dbo.TaskCommitmentLog
AS
SELECT
    sp.SprintId,
    st.StoryId,
    t.TaskId,
    LogDate = sd.Day,
    LogTime = COALESCE(wl.Timestamp, CAST(sd.Day AS DATETIME)),
    TaskLogRecency = ROW_NUMBER() OVER (PARTITION BY t.TaskId, sd.Day ORDER BY COALESCE(wl.Timestamp, CAST(sd.Day AS DATETIME)) DESC),
    MostRecentDevHoursBurned = COALESCE(wl.TaskDevHoursBurned, wl_last.TaskDevHoursBurned, 0.0),
    MostRecentQsHoursBurned = COALESCE(wl.TaskQsHoursBurned, wl_last.TaskQsHoursBurned, 0.0),
    MostRecentRemainingDevHours = COALESCE(wl.TaskRemainingDevHours, wl_last.TaskRemainingDevHours, t.EstimatedDevHours),
    MostRecentRemainingQsHours = COALESCE(wl.TaskRemainingQsHours, wl_last.TaskRemainingQsHours, t.EstimatedQsHours)
FROM
    Sprints sp
    JOIN Stories st ON st.SprintId = sp.SprintId
    JOIN Tasks t ON t.StoryId = st.StoryId
    JOIN SprintDays sd ON 
        sd.SprintId = sp.SprintId
        AND sd.Day <= CAST(GETDATE() AS DATE)
    LEFT JOIN WorkLogs wl ON -- Note: This join may just be a special case of the following join if the following contained "<=" rather than "<".
        wl.TaskId = t.TaskId 
        AND sd.Day = CAST(wl.Timestamp AS DATE)
    LEFT JOIN WorkLogs wl_last ON 
        wl_last.TaskId = t.TaskId
        AND wl_last.Timestamp = (
            SELECT MAX(a.Timestamp) 
            FROM WorkLogs a 
            WHERE a.Timestamp < sd.Day AND t.TaskId = a.TaskId)
        OR wl_last.WorkLogId IS NULL
WHERE
    st.IsReachGoal = 0