
CREATE PROCEDURE UpdateStory
    @StoryId INT,
	@Title VARCHAR(100),
    @StoryText VARCHAR(1000),
	@Notes VARCHAR(MAX),
    @StoryPoints INT,
    @IsReachGoal BIT
AS
BEGIN
    UPDATE Stories SET
		Title = isnull(@Title, ''),
        StoryText = isnull(@StoryText, ''),
		Notes = isnull(@Notes, ''),
        StoryPoints = @StoryPoints,
        IsReachGoal = @IsReachGoal
    WHERE StoryId = @StoryId
END
