CREATE PROCEDURE GetTaskTags
AS
BEGIN
    SELECT
        TaskTagId,
        TaskTagDescription,
        TaskTagClasses
    FROM dbo.TaskTags;
END
