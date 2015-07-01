CREATE SCHEMA MoveTask AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'MoveTask';
GO

CREATE PROCEDURE MoveTask.test_MoveUp
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Move Task 2 to the first position
    EXEC MoveTask 2, 1, 1;

    -- Assert it moved
    SET @actual = (SELECT Ordinal FROM Tasks WHERE TaskId = 2);
    EXEC tSQLt.AssertEquals 1, @actual

    -- And that position one moved down
    SET @actual = (SELECT Ordinal FROM Tasks WHERE TaskId = 1);
    EXEC tSQLt.AssertEquals 2, @actual

END
GO

CREATE PROCEDURE MoveTask.test_MoveDown
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Move Task 1 to the second position
    EXEC MoveTask 1, 1, 2;

    -- Assert it moved
    SET @actual = (SELECT Ordinal FROM Tasks WHERE TaskId = 1);
    EXEC tSQLt.AssertEquals 2, @actual

    -- And that position two moved up
    SET @actual = (SELECT Ordinal FROM Tasks WHERE TaskId = 2);
    EXEC tSQLt.AssertEquals 1, @actual

END
GO

CREATE PROCEDURE MoveTask.test_NoMove
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- "Move" Task 1 to the first position
    EXEC MoveTask 1, 1, 1;

    -- Assert it didn't move
    SET @actual = (SELECT Ordinal FROM Tasks WHERE TaskId = 1);
    EXEC tSQLt.AssertEquals 1, @actual

    -- And the other didn't move
    SET @actual = (SELECT Ordinal FROM Tasks WHERE TaskId = 2);
    EXEC tSQLt.AssertEquals 2, @actual

END
GO

CREATE PROCEDURE MoveTask.test_MoveAcrossStories
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actualStory INT;
    DECLARE @actualOrdinal INT;

    -- We're gonna test the following scenario

    -- Starting with:
    --   Story 1:
    --     Task 1
    --     Task 2
    --   Story 2:
    --     Task 3
    --     Task 4

    -- Ending as:
    --   Story 1:
    --     Task 3
    --     Task 1
    --     Task 2
    --   Story 2:
    --     Task 4

    -- Move Task 3 to the first position of the first story
    EXEC MoveTask 3, 1, 1;

    -- Assert that the story and order of tasks is correct for Tasks 1 -> 4
    SELECT @actualStory = StoryId, @actualOrdinal = Ordinal FROM Tasks WHERE TaskId = 3;
    EXEC tSQLt.AssertEquals 1, @actualStory
    EXEC tSQLt.AssertEquals 1, @actualOrdinal

    SELECT @actualStory = StoryId, @actualOrdinal = Ordinal FROM Tasks WHERE TaskId = 1;
    EXEC tSQLt.AssertEquals 1, @actualStory
    EXEC tSQLt.AssertEquals 2, @actualOrdinal

    SELECT @actualStory = StoryId, @actualOrdinal = Ordinal FROM Tasks WHERE TaskId = 2;
    EXEC tSQLt.AssertEquals 1, @actualStory
    EXEC tSQLt.AssertEquals 3, @actualOrdinal

    SELECT @actualStory = StoryId, @actualOrdinal = Ordinal FROM Tasks WHERE TaskId = 4;
    EXEC tSQLt.AssertEquals 2, @actualStory
    EXEC tSQLt.AssertEquals 1, @actualOrdinal
END
GO
