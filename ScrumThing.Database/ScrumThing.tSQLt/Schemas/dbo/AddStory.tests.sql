CREATE SCHEMA AddStory AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'AddStory';
GO

CREATE PROCEDURE AddStory.test_Successful
AS
BEGIN
    EXEC testScrumThing.SetupTests;

END
GO