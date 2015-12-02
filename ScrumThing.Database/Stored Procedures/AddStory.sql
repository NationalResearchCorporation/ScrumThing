
CREATE PROCEDURE AddStory
    @SprintId INT,
    @Ordinal INT,
    @IsReachGoal BIT
AS
BEGIN
   
    DECLARE @NewStoryID INT
    
    BEGIN TRANSACTION

    UPDATE Stories
    SET Ordinal = Ordinal + 1
    WHERE SprintId = @SprintId AND Ordinal >= @Ordinal;

    INSERT INTO Stories
    (SprintId, Title, StoryText, Notes, StoryPoints, Ordinal, IsReachGoal)
    VALUES
    (@SprintId, '', '', '', '', @Ordinal, @IsReachGoal);

    SET @NewStoryId = SCOPE_IDENTITY();
	
    SELECT NewStoryID = @NewStoryId

    SELECT StoryId, Ordinal
    FROM Stories
    WHERE SprintId = @SprintId;

    COMMIT TRANSACTION

    RETURN @NewStoryID
END
