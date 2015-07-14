CREATE SCHEMA UpdateSprint AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'UpdateSprint';
GO

CREATE PROCEDURE UpdateSprint.test_Successful_UpdateName
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @SprintId INT,
			@Name VARCHAR(200)

	SELECT  @SprintId = SprintId,
			@Name = Name
	FROM Sprints
	WHERE SprintId = 1

	DECLARE @NewName VARCHAR(200) = 'Sprint 1 (Test)';

	EXEC UpdateSprint @SprintId, @NewName
	
	DECLARE @ActualName VARCHAR(200);
	SELECT  @ActualName = Name FROM Sprints WHERE SprintId = 1

	EXEC tSQLt.AssertEqualsString @NewName, @ActualName;
END
GO