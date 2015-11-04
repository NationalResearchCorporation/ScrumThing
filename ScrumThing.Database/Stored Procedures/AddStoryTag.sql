
CREATE PROCEDURE AddStoryTag
    @StoryTagDescription VARCHAR(50)
AS
BEGIN
    INSERT INTO StoryTags (StoryTagDescription)
    VALUES (@StoryTagDescription)

    SELECT
        StoryTagId = CAST(SCOPE_IDENTITY() AS INT),
        StoryTagDescription = @StoryTagDescription
END
