
CREATE PROCEDURE GetStoryTags
AS
BEGIN
    SELECT
        StoryTagId,
        StoryTagDescription
    FROM dbo.StoryTags;
END
