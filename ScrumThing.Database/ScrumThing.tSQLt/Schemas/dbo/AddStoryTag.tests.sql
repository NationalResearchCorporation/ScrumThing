CREATE SCHEMA AddStoryTag AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'AddStoryTag';
GO

CREATE PROCEDURE AddStoryTag.test_Successful
AS
BEGIN
    EXEC testScrumThing.SetupTests;

    EXEC AddStoryTag 'NewStoryTag';

    DECLARE @StoryTagCount INT = (SELECT COUNT(*) FROM StoryTags)
    EXEC tSQLt.AssertEquals 1, @StoryTagCount

    DECLARE @TeamStoryTagSettingCount INT = (SELECT COUNT(*) FROM TeamStoryTagSettings)
    EXEC tSQLt.AssertEquals 2, @TeamStoryTagSettingCount
END
GO
