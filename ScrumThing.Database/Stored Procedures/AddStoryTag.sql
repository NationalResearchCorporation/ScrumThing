
CREATE PROCEDURE AddStoryTag
    @StoryTagDescription VARCHAR(50)
AS
BEGIN
    DECLARE @NextOrdinal INT = (SELECT COALESCE(MAX(Ordinal) + 1, 0) FROM StoryTags)

    INSERT INTO StoryTags (StoryTagDescription, Ordinal)
    VALUES (@StoryTagDescription, @NextOrdinal)

    DECLARE @StoryTagId INT = SCOPE_IDENTITY()

    INSERT INTO TeamStoryTagSettings (TeamId, StoryTagId)
    SELECT TeamId, @StoryTagId
    FROM Teams

    SELECT
        StoryTagId = @StoryTagId,
        StoryTagDescription = @StoryTagDescription,
        Ordinal = @NextOrdinal,
        [Enabled] = 1
END
