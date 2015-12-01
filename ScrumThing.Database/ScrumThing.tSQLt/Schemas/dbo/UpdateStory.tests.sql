CREATE SCHEMA UpdateStory AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'UpdateStory';
GO

CREATE PROCEDURE UpdateStory.test_Successful_UpdateStoryText
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @StoryId INT,
			@StoryText VARCHAR(1000),
			@StoryPoints INT,
			@IsReachGoal BIT,
			@Title VARCHAR(100)

	SELECT  @StoryId = StoryId,
			@StoryText = StoryText,
			@StoryPoints = StoryPoints,
			@IsReachGoal = IsReachGoal,
			@Title = Title
	FROM Stories
	WHERE StoryId = 1

	DECLARE @NewStoryText VARCHAR(1000) = 'Story 1 (Test)';

	EXEC UpdateStory @StoryId, @NewStoryText, @StoryPoints, @IsReachGoal, @Title
	
	DECLARE @ActualStoryText VARCHAR(1000);
	SELECT  @ActualStoryText = StoryText FROM Stories WHERE StoryId = 1

	EXEC tSQLt.AssertEqualsString @NewStoryText, @ActualStoryText;
END
GO

CREATE PROCEDURE UpdateStory.test_Successful_UpdateTitle
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @StoryId INT,
			@StoryText VARCHAR(1000),
			@StoryPoints INT,
			@IsReachGoal BIT,
			@Title VARCHAR(100)

	SELECT  @StoryId = StoryId,
			@StoryText = StoryText,
			@StoryPoints = StoryPoints,
			@IsReachGoal = IsReachGoal,
			@Title = Title
	FROM Stories
	WHERE StoryId = 1

	DECLARE @NewTitle VARCHAR(1000) = 'Title New';

	EXEC UpdateStory @StoryId, @StoryText, @StoryPoints, @IsReachGoal, @NewTitle
	
	DECLARE @ActualTitle VARCHAR(1000);
	SELECT  @ActualTitle = Title FROM Stories WHERE StoryId = 1

	EXEC tSQLt.AssertEqualsString @NewTitle, @ActualTitle;
END
GO