CREATE PROCEDURE [dbo].[LogWork]
    @TaskId INT,
    @LoggedBy VARCHAR(40) = NULL,
    @Date DATE = NULL
AS
BEGIN
    DECLARE @SprintId INT = (
        SELECT s.SprintId
        FROM Tasks t JOIN Stories s ON t.StoryId = s.StoryId
        WHERE TaskId = @TaskId);

    DECLARE @DevHoursBurned FLOAT;
    DECLARE @RemainingDevHours FLOAT;
    DECLARE @QsHoursBurned FLOAT;
    DECLARE @RemainingQsHours FLOAT;

    SELECT
        @DevHoursBurned = DevHoursBurned,
        @QsHoursBurned = QsHoursBurned,
        @RemainingDevHours = RemainingDevHours,
        @RemainingQsHours = RemainingQsHours
    FROM Tasks
    WHERE TaskId = @TaskId;

    INSERT INTO WorkLogs (
        LoggedBy,
        SprintId, 
        TaskId, 
        TaskDevHoursBurned, 
        TaskQsHoursBurned, 
        TaskRemainingDevHours, 
        TaskRemainingQsHours,
        [Timestamp]
    )
    VALUES (
        ISNULL(@LoggedBy, dbo.SystemUserName()),
        @SprintId, 
        @TaskId, 
        @DevHoursBurned, 
        @QsHoursBurned, 
        @RemainingDevHours, 
        @RemainingQsHours,
        ISNULL(@DATE, GETDATE())
    );
END
