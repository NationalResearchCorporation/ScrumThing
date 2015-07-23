
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

    COMMIT
END
