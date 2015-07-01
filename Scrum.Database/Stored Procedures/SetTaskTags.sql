-- =============================================
-- Set the Tags for a given Task
-- =============================================
CREATE PROCEDURE [dbo].[SetTaskTags]
    @TaskId INT,
    @Tags VARCHAR(MAX)
AS
BEGIN

    BEGIN TRANSACTION

    DECLARE @TagIds TABLE ( TagId INT NOT NULL );
    INSERT INTO @TagIds ( TagId )
    SELECT s FROM SplitString(@Tags, '|')
    WHERE S <> '';

    DELETE FROM TasksInTags
    WHERE TaskId = @TaskId
      AND TagId NOT IN (SELECT TagId from @TagIds);

    INSERT INTO TasksInTags (TaskId, TagId)
    SELECT @TaskId, TagId
    FROM @TagIds T
    WHERE T.TagId NOT IN (SELECT TagId FROM TasksInTags WHERE TaskId = @TaskId);

    COMMIT

END
