-- =============================================
-- Author:		Joe Colasurdo
-- Create date: 5/16/2015   
-- Description:	Returns the hours used for burndown charting.
-- =============================================

CREATE PROCEDURE [dbo].[GetBurndown]
    @SprintId INT,
    @RelativeDate DATETIME -- This isn't actually used in this version, but is retained to reduce impact on endpoints.
AS
BEGIN
    
    DECLARE @EstimatedHours DECIMAL(9,4) = (
        SELECT SUM(t.EstimatedDevHours + t.EstimatedQsHours)
        FROM Tasks t
        JOIN Stories s ON t.StoryId = s.StoryId
        WHERE s.SprintId = @SprintId
        AND s.IsReachGoal = 0
    );

    DECLARE @NumberOfSprintDays INT = (
        SELECT COUNT(DISTINCT sd.[Day])
        FROM SprintDays sd
        WHERE sd.SprintId = @SprintId
    );

    -- We subtract one from the number of sprint days because we don't expect hours posted on day 1.
    DECLARE @IdealHoursPerDay FLOAT = dbo.SafeDivide(@EstimatedHours, @NumberOfSprintDays - 1); 
    
    WITH SprintLog (
        SprintId, 
        SprintDay, 
        HoursBurned, 
        HoursRemaining) 
    AS (SELECT 
            tcl.SprintId,
            SprintDay = tcl.LogDate,
            HoursBurned = SUM(tcl.MostRecentDevHoursBurned + tcl.MostRecentQsHoursBurned),
            HoursRemaining = SUM(tcl.MostRecentRemainingDevHours + tcl.MostRecentRemainingQsHours)
        FROM
            TaskCommitmentLog tcl
        WHERE 
            TaskLogRecency = 1
        GROUP BY
            tcl.SprintId,
            tcl.LogDate)

    SELECT
        SprintDay = sd.Day,
        HoursBurned = CAST(sl.HoursBurned AS DECIMAL(9,4)),
        HoursRemaining = CAST(sl.HoursRemaining AS DECIMAL(9,4)),
        IdealHoursRemaining = @EstimatedHours
                            - SUM(@IdealHoursPerDay) OVER(ORDER BY sd.Day ROWS UNBOUNDED PRECEDING) 
                            + @IdealHoursPerDay, -- This bumps the chart up the y-axis to account for being short one day.
        Preliminary = IIF(sd.Day >= CAST(@RelativeDate AS DATE), 1, 0)
    FROM
        SprintLog sl
        RIGHT JOIN SprintDays sd ON 
            sd.Day = sl.SprintDay 
            AND sd.SprintId = sl.SprintId
    WHERE 
        sd.SprintId = @SprintId

END