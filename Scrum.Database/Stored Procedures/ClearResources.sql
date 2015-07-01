
CREATE PROCEDURE ClearResources
	@SprintId INT
AS
BEGIN
	DELETE FROM Resources
	WHERE SprintId = @SprintId
END
