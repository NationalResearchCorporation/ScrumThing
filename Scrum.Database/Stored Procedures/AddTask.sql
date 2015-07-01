
CREATE PROCEDURE AddTask
    @StoryId INT
AS
BEGIN
    BEGIN TRANSACTION

    DECLARE @Ordinal INT = (SELECT COALESCE(MAX(Ordinal) + 1, 1)
                            FROM Tasks
                            WHERE StoryId = @StoryId);

    INSERT INTO Tasks
    (StoryId, TaskText, [State], Ordinal, EstimatedDevHours, EstimatedQsHours, DevHoursBurned, QsHoursBurned, RemainingDevHours, RemainingQsHours)
    VALUES
    (@StoryId, '', 'ReadyForDev', @Ordinal, 0, 0, 0, 0, 0, 0);

    DECLARE @id INT = SCOPE_IDENTITY();

    SELECT TaskId, Ordinal
    FROM Tasks
    WHERE TaskId = @id;

    -- We log the initial condition of the task so that the log reflects the state of all tasks
    -- even before any work has actually been done on them.
    EXEC LogWork @Id

    COMMIT
END
