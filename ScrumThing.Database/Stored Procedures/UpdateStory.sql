
CREATE PROCEDURE UpdateStory
    @StoryId INT,
    @StoryText VARCHAR(1000),
    @StoryPoints INT,
    @IsReachGoal BIT,
	@Title VARCHAR(100)
AS
BEGIN
    UPDATE Stories SET
        StoryText = isnull(@StoryText, ''),
        StoryPoints = @StoryPoints,
        IsReachGoal = @IsReachGoal,
		Title = isnull(@Title, '')
    WHERE StoryId = @StoryId
END
