CREATE SCHEMA AddNote AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'AddNote';
GO

CREATE PROCEDURE AddNote.test_Successful_AddNote
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @TaskId INT,
			@UserName VARCHAR(40),
			@Note VARCHAR(MAX);

	DECLARE @ActualValue TABLE (
		TaskId INT,
		UserName VARCHAR(40),
		Note VARCHAR(MAX),
		[TimeStamp] VARCHAR(20)
	)

	SET @TaskId = 1;
	SET @UserName = 'User1';
	SET @Note = 'This is test successful note.';

	INSERT INTO @ActualValue
	EXEC dbo.AddNote @TaskId, @UserName, @Note;

	DECLARE @ActualNote VARCHAR(MAX);
	SELECT @ActualNote = Note FROM @ActualValue;

	EXEC tSQLt.AssertEqualsString @Note, @ActualNote;
END
GO