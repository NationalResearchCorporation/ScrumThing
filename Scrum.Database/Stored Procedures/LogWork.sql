CREATE PROCEDURE [dbo].[LogWork]
    @TaskId INT,
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
        SprintId, 
        TaskId, 
        TaskDevHoursBurned, 
        TaskQsHoursBurned, 
        TaskRemainingDevHours, 
        TaskRemainingQsHours,
        [Timestamp]
    )
    VALUES (
        @SprintId, 
        @TaskId, 
        @DevHoursBurned, 
        @QsHoursBurned, 
        @RemainingDevHours, 
        @RemainingQsHours,
        COALESCE(@DATE, GETDATE())
    );
END
