
CREATE PROCEDURE SetAssignments
    @TaskId INT,
    @Assignments VARCHAR(MAX)
AS
BEGIN
    BEGIN TRANSACTION

    DELETE FROM Assignments
    WHERE TaskId = @TaskId

    INSERT INTO Assignments (TaskId, UserName)
    SELECT
        TaskId = @TaskId,
        UserName = s
    FROM SplitString(@Assignments, '|');

    COMMIT TRANSACTION
END
