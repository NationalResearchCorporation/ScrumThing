CREATE PROCEDURE [dbo].[GetEstimatesVsActuals]
	@SprintId INT
AS
BEGIN
	SELECT
		s.StoryID,
		[StoryOrdinal] = s.Ordinal,
		s.Title as StoryTitle,
		s.StoryText,
		t.TaskID,
		[TaskOrdinal] = t.Ordinal,
		t.TaskText,
		t.EstimatedDevHours,
		t.DevHoursBurned,
		t.EstimatedQsHours,
		t.QsHoursBurned
	FROM Tasks t
	JOIN Stories s on t.StoryId = s.StoryId
	WHERE SprintID = @SprintId
	ORDER BY s.Ordinal, t.Ordinal
END