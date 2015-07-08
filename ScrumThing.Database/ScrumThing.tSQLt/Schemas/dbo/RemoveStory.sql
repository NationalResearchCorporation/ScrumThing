CREATE SCHEMA RemoveStory AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'RemoveStory';
GO

CREATE PROCEDURE RemoveStory.test_RemoveStoryFixesOrdinals
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Add a third story to the sprint
    EXEC AddStory 1;

    -- Delete the second story from the sprint
    EXEC RemoveStory 2;

    -- Make sure the missing story got repaired
    SET @actual = (SELECT COUNT(*) FROM Stories WHERE Ordinal = 1 AND SprintId = 1);
    EXEC tSQLt.AssertEquals 1, @actual

    SET @actual = (SELECT COUNT(*) FROM Stories WHERE Ordinal = 2 AND SprintId = 1);
    EXEC tSQLt.AssertEquals 1, @actual

    SET @actual = (SELECT COUNT(*) FROM Stories WHERE Ordinal = 3 AND SprintId = 1);
    EXEC tSQLt.AssertEquals 0, @actual
END
GO
