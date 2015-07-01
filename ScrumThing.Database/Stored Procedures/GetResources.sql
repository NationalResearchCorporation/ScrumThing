
CREATE PROCEDURE GetResources
	@SprintId INT
AS
BEGIN
	SELECT
		SprintId,
		UserName,
		DevPercentage,
		QsPercentage,
		[Days],
		TotalDevHours,
		TotalQsHours,
		TotalHours
	FROM Resources
	WHERE SprintId = @SprintId;
END
