CREATE SCHEMA AddSprint AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'AddSprint';
GO

CREATE PROCEDURE AddSprint.test_Successful_CustomNamedSprint
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @TeamId INT,
			@Name VARCHAR(200),
			@returnedvalue INT;

	SET @TeamId = 1;
	SET @Name = 'Sprint 5';

	EXEC @returnedvalue = dbo.AddSprint @TeamId, @Name;

	EXEC tSQLt.AssertEquals @returnedvalue, 5;
END
GO