IF (NOT EXISTS( SELECT TOP 1 * FROM dbo.TaskTags ))
BEGIN

    INSERT INTO dbo.TaskTags( TaskTagId, TaskTagDescription, TaskTagClasses)
    VALUES
    ( 1 , 'Paired Programming', 'label label-info'),
    ( 2 , 'Timeboxed', 'label label-danger')

END