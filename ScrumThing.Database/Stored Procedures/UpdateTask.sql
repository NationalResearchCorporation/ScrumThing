
CREATE PROCEDURE [dbo].[UpdateTask]
    @LoggedBy VARCHAR(40),
    @TaskId INT,
    @TaskText VARCHAR(1000),
    @State VARCHAR(20),
    @EstimatedDevHours FLOAT,
    @EstimatedQsHours FLOAT,
    @DevHoursBurned FLOAT,
    @QsHoursBurned FLOAT,
    @RemainingDevHours FLOAT,
    @RemainingQsHours FLOAT,
    @TaskTags VARCHAR(MAX)
AS
BEGIN
    BEGIN TRANSACTION

    DECLARE @PreviousTaskText VARCHAR(1000) = (SELECT TaskText FROM Tasks WHERE TaskId = @TaskId);
    DECLARE @PreviousEstimatedDevHours FLOAT = (SELECT EstimatedDevHours FROM Tasks WHERE TaskId = @TaskId);
    DECLARE @PreviousEstimatedQsHours FLOAT = (SELECT EstimatedQsHours FROM Tasks WHERE TaskId = @TaskId);

    -- If we are updating estimated hours, then reset burned and remaining
    IF @TaskText != @PreviousTaskText OR @EstimatedDevHours != @PreviousEstimatedDevHours OR @EstimatedQsHours != @PreviousEstimatedQsHours BEGIN
        SET @DevHoursBurned = 0
        SET @RemainingDevHours = @EstimatedDevHours
        SET @QsHoursBurned = 0
        SET @RemainingQsHours = @EstimatedQsHours
    END

    DECLARE @NeedToLogWork BIT = (
        SELECT
            CASE WHEN
                DevHoursBurned != @DevHoursBurned OR
                RemainingDevHours != @RemainingDevHours OR
                QsHoursBurned != @QsHoursBurned OR
                RemainingQsHours != @RemainingQsHours
            THEN 1 ELSE 0 END
        FROM Tasks
        WHERE TaskId = @TaskId);

    UPDATE Tasks SET
        TaskText = @TaskText,
        [State] = @State,
        EstimatedDevHours = @EstimatedDevHours,
        EstimatedQsHours = @EstimatedQsHours,
        DevHoursBurned = @DevHoursBurned,
        QsHoursBurned = @QsHoursBurned,
        RemainingDevHours = @RemainingDevHours,
        RemainingQsHours = @RemainingQsHours
    WHERE TaskId = @TaskId;

    EXEC dbo.SetTaskTags @TaskId, @TaskTags

    IF @NeedToLogWork = 1 BEGIN
        EXEC dbo.LogWork @TaskId, @LoggedBy
    END

    COMMIT
END
