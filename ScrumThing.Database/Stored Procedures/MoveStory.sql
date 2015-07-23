
CREATE PROCEDURE MoveStory
    @StoryId INT,
    @NewOrdinal INT,
    @IsReachGoal BIT
AS
BEGIN

    BEGIN TRANSACTION

    DECLARE @SprintId INT;
    DECLARE @OldOrdinal INT;

    SELECT
        @SprintId = SprintId,
        @OldOrdinal = Ordinal
    FROM Stories
    WHERE StoryId = @StoryId;

    IF @NewOrdinal < @OldOrdinal BEGIN
        -- We'll be moving this story up, so move the relevant stories down a position
        UPDATE Stories
        SET Ordinal = Ordinal + 1
        WHERE SprintId = @SprintId AND Ordinal >= @NewOrdinal AND Ordinal <= @OldOrdinal;
    END

    IF @NewOrdinal > @OldOrdinal BEGIN
        -- We'll be moving this story down, so move the relevant stories up a position
        UPDATE Stories
        SET Ordinal = Ordinal - 1
        WHERE SprintId = @SprintId AND Ordinal >= @OldOrdinal AND Ordinal <= @NewOrdinal;
    END

    -- And then move this story into the new position
    UPDATE Stories SET
	Ordinal = @NewOrdinal,
	IsReachGoal = @IsReachGoal
    WHERE StoryId = @StoryId;

    -- Return all updated information so the front end doesn't have to replicate it
    SELECT StoryId, Ordinal, IsReachGoal
    FROM Stories
    WHERE SprintId = @SprintId;

    COMMIT 

END
