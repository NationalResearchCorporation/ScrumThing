CREATE SCHEMA FixOrdinals AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'FixOrdinals';
GO

CREATE PROCEDURE FixOrdinals.test_FixAll
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Jank up all the Ordinals
    UPDATE Tasks
    SET Ordinal = 3
    WHERE Ordinal = 2;

    -- Fix up everything
    EXEC FixOrdinals;

    -- Make sure there are the correct number of Ordinal 1's, 2's, and 3's
    -- And they are the right number of 1's and 2's
    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 1);
    EXEC tSQLt.AssertEquals 8, @actual

    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 2);
    EXEC tSQLt.AssertEquals 8, @actual

    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 3);
    EXEC tSQLt.AssertEquals 0, @actual
END
GO

CREATE PROCEDURE FixOrdinals.test_FixSprint
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Jank up all the Ordinals
    UPDATE Tasks
    SET Ordinal = 3
    WHERE Ordinal = 2;

    -- Fix up just sprint 1
    EXEC FixOrdinals 1;

    -- Make sure there are the correct number of Ordinal 1's, 2's, and 3's
    -- And they are the right number of 1's and 2's
    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 1);
    EXEC tSQLt.AssertEquals 8, @actual

    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 2);
    EXEC tSQLt.AssertEquals 2, @actual

    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 3);
    EXEC tSQLt.AssertEquals 6, @actual
END
GO

CREATE PROCEDURE FixOrdinals.test_FixStory
AS
BEGIN
    EXEC testScrumThing.SetupTests;
    DECLARE @actual INT;

    -- Jank up all the Ordinals
    UPDATE Tasks
    SET Ordinal = 3
    WHERE Ordinal = 2;

    -- Fix up just story 1
    EXEC FixOrdinals 1, 1;

    -- Make sure there are the correct number of Ordinal 1's, 2's, and 3's
    -- And they are the right number of 1's and 2's
    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 1);
    EXEC tSQLt.AssertEquals 8, @actual

    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 2);
    EXEC tSQLt.AssertEquals 1, @actual

    SET @actual = (SELECT COUNT(*) FROM Tasks WHERE Ordinal = 3);
    EXEC tSQLt.AssertEquals 7, @actual
END
GO
