
CREATE PROCEDURE AddNote
	@TaskId INT,
	@UserName VARCHAR(40),
	@Note VARCHAR(MAX)
AS
BEGIN
	INSERT INTO Notes
	(TaskId, UserName, Note, [Timestamp])
	VALUES
	(@TaskId, @UserName, @Note, GETDATE())

	SELECT
		TaskId,
		UserName,
		Note, 
		[TimeStamp] = CONVERT(VARCHAR(20), [Timestamp], 120)
	FROM Notes
	WHERE NoteId = SCOPE_IDENTITY()
END
