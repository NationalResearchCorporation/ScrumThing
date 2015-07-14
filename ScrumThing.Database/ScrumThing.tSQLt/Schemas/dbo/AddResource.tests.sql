CREATE SCHEMA AddResource AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'AddResource';
GO

CREATE PROCEDURE AddResource.test_Successful
AS
BEGIN
    EXEC testScrumThing.SetupTests;
	DECLARE @actual INT;

	EXEC AddResource 4, 'ResourceUser', 0, 50, 4, 0, 4, 4;

	SET @actual = (SELECT QsPercentage FROM Resources WHERE UserName = 'ResourceUser');
	EXEC tSQLt.AssertEquals 50, @actual;
END
GO