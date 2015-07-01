
CREATE PROCEDURE GetSprints
	@TeamId INT
AS
BEGIN
	SELECT SprintId, Name
	FROM Sprints
	WHERE TeamId = @TeamId;
END
