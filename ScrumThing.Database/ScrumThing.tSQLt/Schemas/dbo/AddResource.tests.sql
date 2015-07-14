CREATE SCHEMA AddResource AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'AddResource';
GO

CREATE PROCEDURE AddResource.test_Successful
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	
END
GO