
CREATE PROCEDURE [dbo].[SetTaskTags]
    @TaskId INT,
    @TaskTags VARCHAR(MAX)
AS
BEGIN
    BEGIN TRANSACTION

    DECLARE @TagIds TABLE ( TagId INT NOT NULL );
    INSERT INTO @TagIds ( TagId )
    SELECT s FROM SplitString(@TaskTags, '|')
    WHERE s <> '';

    DELETE FROM TasksInTags
    WHERE TaskId = @TaskId;

    INSERT INTO TasksInTags (TaskId, TaskTagId)
    SELECT @TaskId, TagId
    FROM @TagIds T;

    COMMIT
END
