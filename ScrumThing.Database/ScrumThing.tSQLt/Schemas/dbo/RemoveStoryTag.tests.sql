CREATE SCHEMA RemoveStoryTag AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'RemoveStoryTag';
GO

CREATE PROCEDURE RemoveStoryTag.test_Successful
AS
BEGIN
    EXEC testScrumThing.SetupTests;

    EXEC AddStoryTag 'NewStoryTag'
    DECLARE @StoryTagId INT = (SELECT MIN(StoryTagId) FROM StoryTags);

    EXEC RemoveStoryTag @StoryTagId
    DECLARE @StoryTagCount INT = (SELECT COUNT(*) FROM StoryTags);

    EXEC tSQLt.AssertEquals 0, @StoryTagCount
END
GO

CREATE PROCEDURE RemoveStoryTag.test_StoryTagInUse_LeavesTag
AS
BEGIN
    EXEC testScrumThing.SetupTests;

    EXEC AddStoryTag 'NewStoryTag'
    DECLARE @StoryTagId INT = (SELECT MIN(StoryTagId) FROM StoryTags);

    EXEC SetStoryTags 1, @StoryTagId

    EXEC RemoveStoryTag @StoryTagId
    DECLARE @StoryTagCount INT = (SELECT COUNT(*) FROM StoryTags);

    EXEC tSQLt.AssertEquals 1, @StoryTagCount
END
GO
