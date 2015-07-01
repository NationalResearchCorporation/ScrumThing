CREATE SCHEMA MoveStory AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'MoveStory';
GO

CREATE PROCEDURE MoveStory.test_MoveUp
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Move Story 2 to the first position
    EXEC MoveStory 2, 1;

    -- Assert it moved
    SET @actual = (SELECT Ordinal FROM Stories WHERE StoryId = 2);
    EXEC tSQLt.AssertEquals 1, @actual

    -- And that position one moved down
    SET @actual = (SELECT Ordinal FROM Stories WHERE StoryId = 1);
    EXEC tSQLt.AssertEquals 2, @actual

END
GO

CREATE PROCEDURE MoveStory.test_MoveDown
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Move Story 1 to the second position
    EXEC MoveStory 1, 2;

    -- Assert it moved
    SET @actual = (SELECT Ordinal FROM Stories WHERE StoryId = 1);
    EXEC tSQLt.AssertEquals 2, @actual

    -- And that position two moved up
    SET @actual = (SELECT Ordinal FROM Stories WHERE StoryId = 2);
    EXEC tSQLt.AssertEquals 1, @actual

END
GO

CREATE PROCEDURE MoveStory.test_NoMove
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- "Move" Story 1 to the first position
    EXEC MoveStory 1, 1;

    -- Assert it didn't move
    SET @actual = (SELECT Ordinal FROM Stories WHERE StoryId = 1);
    EXEC tSQLt.AssertEquals 1, @actual

    -- And the other didn't move
    SET @actual = (SELECT Ordinal FROM Stories WHERE StoryId = 2);
    EXEC tSQLt.AssertEquals 2, @actual

END
GO
