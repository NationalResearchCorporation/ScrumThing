IF (NOT EXISTS( SELECT TOP 1 * FROM dbo.StoryTags ))
BEGIN

    INSERT INTO dbo.StoryTags( StoryTagId, StoryTagDescription )
    VALUES
    (0, 'Research'),
    (1, 'Infrastructure'),
    (2, 'UI'),
    (3, 'Onboarding'),
    (4, 'Refactor'),
    (5, 'Comments')

END