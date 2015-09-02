
CREATE PROCEDURE AddStory
    @SprintId INT,
    @Ordinal INT,
    @IsReachGoal BIT
AS
BEGIN
    BEGIN TRANSACTION

    UPDATE Stories
    SET Ordinal = Ordinal + 1
    WHERE SprintId = @SprintId AND Ordinal >= @Ordinal;

    INSERT INTO Stories
    (SprintId, StoryText, StoryPoints, Ordinal, IsReachGoal)
    VALUES
    (@SprintId, '', '', @Ordinal, @IsReachGoal);

    SELECT NewStoryId = SCOPE_IDENTITY();

    SELECT StoryId, Ordinal
    FROM Stories
    WHERE SprintId = @SprintId;

    COMMIT TRANSACTION
END
