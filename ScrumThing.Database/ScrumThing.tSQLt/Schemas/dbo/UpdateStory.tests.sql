CREATE SCHEMA UpdateStory AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'UpdateStory';
GO

CREATE PROCEDURE UpdateStory.test_Successful_UpdateStoryText
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @StoryId INT,
			@Title VARCHAR(100),
			@StoryText VARCHAR(1000),
			@Notes VARCHAR(MAX),
			@StoryPoints INT,
			@IsReachGoal BIT

	SELECT  @StoryId = StoryId,
			@Title = Title,
			@StoryText = StoryText,
			@Notes = Notes,
			@StoryPoints = StoryPoints,
			@IsReachGoal = IsReachGoal
	FROM Stories
	WHERE StoryId = 1

	DECLARE @NewStoryText VARCHAR(1000) = 'Story 1 (Test)';

	EXEC UpdateStory @StoryId, @Title, @NewStoryText, @Notes, @StoryPoints, @IsReachGoal
	
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
			@Title VARCHAR(100),
			@StoryText VARCHAR(1000),
			@Notes VARCHAR(MAX),
			@StoryPoints INT,
			@IsReachGoal BIT

	SELECT  @StoryId = StoryId,
			@Title = Title,
			@StoryText = StoryText,
			@Notes = Notes,
			@StoryPoints = StoryPoints,
			@IsReachGoal = IsReachGoal
	FROM Stories
	WHERE StoryId = 1

	DECLARE @NewTitle VARCHAR(1000) = 'Title New';

	EXEC UpdateStory @StoryId, @NewTitle, @StoryText, @Notes, @StoryPoints, @IsReachGoal
	
	DECLARE @ActualTitle VARCHAR(1000);
	SELECT  @ActualTitle = Title FROM Stories WHERE StoryId = 1

	EXEC tSQLt.AssertEqualsString @NewTitle, @ActualTitle;
END
GO

CREATE PROCEDURE UpdateStory.test_Successful_UpdateNotes
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @StoryId INT,
			@Title VARCHAR(100),
			@StoryText VARCHAR(1000),
			@Notes VARCHAR(MAX),
			@StoryPoints INT,
			@IsReachGoal BIT

	SELECT  @StoryId = StoryId,
			@Title = Title,
			@StoryText = StoryText,
			@Notes = Notes,
			@StoryPoints = StoryPoints,
			@IsReachGoal = IsReachGoal
	FROM Stories
	WHERE StoryId = 1

	DECLARE @NewNotes VARCHAR(1000) = 'Notes New';

	EXEC UpdateStory @StoryId, @Title, @StoryText, @NewNotes, @StoryPoints, @IsReachGoal
	
	DECLARE @ActualNotes VARCHAR(1000);
	SELECT  @ActualNotes = Notes FROM Stories WHERE StoryId = 1

	EXEC tSQLt.AssertEqualsString @NewNotes, @ActualNotes;
END
GO