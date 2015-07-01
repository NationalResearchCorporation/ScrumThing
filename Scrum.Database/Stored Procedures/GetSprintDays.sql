
CREATE PROCEDURE GetSprintDays
	@SprintId INT
AS
BEGIN
	SELECT [Day] = CONVERT(VARCHAR(10), [Day], 101)
	FROM SprintDays
	WHERE SprintId = @SprintId
END
