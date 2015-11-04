
CREATE PROCEDURE RemoveStoryTag
    @StoryTagId INT
AS
BEGIN
    IF EXISTS(SELECT * FROM StoriesInTags WHERE StoryTagId = @StoryTagId)
    BEGIN
        SELECT Success = 0
    END
    ELSE
    BEGIN
        DELETE StoryTags
        WHERE StoryTagId = @StoryTagId

        SELECT Success = 1
    END
END
