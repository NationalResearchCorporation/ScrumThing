
CREATE PROCEDURE [dbo].[SetStoryTags]
    @StoryId INT,
    @StoryTagIds VARCHAR(MAX)
AS
BEGIN
    BEGIN TRANSACTION

    DECLARE @TagIds TABLE ( TagId INT NOT NULL );
    INSERT INTO @TagIds ( TagId )
    SELECT s FROM SplitString(@StoryTagIds, '|')
    WHERE s <> '';

    DELETE FROM StoriesInTags
    WHERE StoryId = @StoryId;

    INSERT INTO StoriesInTags (StoryId, StoryTagId)
    SELECT @StoryId, TagId
    FROM @TagIds t;

    SELECT
        sit.StoryId,
        st.StoryTagId,
        st.StoryTagDescription
    FROM dbo.StoryTags st
    JOIN dbo.StoriesInTags sit ON st.StoryTagId = sit.StoryTagId
    WHERE sit.StoryId = @StoryId;

    COMMIT
END
