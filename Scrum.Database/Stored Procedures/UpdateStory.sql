
CREATE PROCEDURE UpdateStory
    @StoryId INT,
    @StoryText VARCHAR(1000),
    @StoryPoints INT,
    @IsReachGoal BIT
AS
BEGIN
    UPDATE Stories SET
        StoryText = @StoryText,
        StoryPoints = @StoryPoints,
        IsReachGoal = @IsReachGoal
    WHERE StoryId = @StoryId
END
