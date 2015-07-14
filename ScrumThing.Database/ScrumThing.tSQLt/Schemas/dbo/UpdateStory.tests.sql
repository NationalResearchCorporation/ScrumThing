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
			@IsReachGoal BIT

	SELECT  @StoryId = StoryId,
			@StoryText = StoryText,
			@StoryPoints = StoryPoints,
			@IsReachGoal = IsReachGoal
	FROM Stories
	WHERE StoryId = 1

	DECLARE @NewStoryText VARCHAR(1000) = 'Story 1 (Test)';

	EXEC UpdateStory @StoryId, @NewStoryText, @StoryPoints, @IsReachGoal
	
	DECLARE @ActualStoryText VARCHAR(1000);
	SELECT  @ActualStoryText = StoryText FROM Stories WHERE StoryId = 1

	EXEC tSQLt.AssertEqualsString @NewStoryText, @ActualStoryText;
END
GO