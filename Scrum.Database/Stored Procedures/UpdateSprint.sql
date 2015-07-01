CREATE PROCEDURE [dbo].[UpdateSprint]
	@SprintId INT,
	@Name VARCHAR(200)
AS

BEGIN

	UPDATE dbo.Sprints
	SET 	
	Name = @Name
	WHERE SprintId = @SprintId

END
