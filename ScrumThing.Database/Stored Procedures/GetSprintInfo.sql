
-- Returns all stories, tasks, and assignments for a given sprint
CREATE PROCEDURE GetSprintInfo
	@SprintId INT
AS
BEGIN
	SELECT
		SprintId,
		StoryId,
		StoryText,
		StoryPoints,
		Ordinal,
        IsReachGoal
	FROM Stories
	WHERE SprintId = @SprintId;

	SELECT
		t.StoryId,
		t.TaskId,
		t.TaskText,
        t.[State],
		t.Ordinal,
        t.EstimatedDevHours,
        t.EstimatedQsHours,
        t.DevHoursBurned,
        t.QsHoursBurned,
        t.RemainingDevHours,
        t.RemainingQsHours
	FROM Stories s
	JOIN Tasks t ON s.StoryId = t.StoryId
	WHERE s.SprintId = @SprintId;

	SELECT
		a.UserName,
		a.TaskId
	FROM Assignments a
	JOIN Tasks t ON a.TaskId = t.TaskId
	JOIN Stories s ON t.StoryId = s.StoryId
	WHERE s.SprintId = @SprintId;
	
	SELECT
		n.TaskId,
		n.UserName,
		n.Note,
		[TimeStamp] = CONVERT(VARCHAR(20), n.[Timestamp], 120)
	FROM Notes n
	JOIN Tasks t ON n.TaskId = t.TaskId
	JOIN Stories s ON t.StoryId = s.StoryId
    WHERE s.SprintId = @SprintId
	ORDER BY [Timestamp] DESC

	-- Tags
	SELECT 
		t.TaskId,
		tg.TagId,
		tg.TagDescription,
		tg.TagClasses,
		CASE WHEN tt.TaskId IS NOT NULL THEN 1 ELSE 0 END AS IsIncluded
	FROM Stories s
	JOIN Tasks t ON s.StoryId = t.StoryId
	CROSS JOIN dbo.Tags AS tg
	LEFT JOIN dbo.TasksInTags AS tt ON tt.TaskId = t.TaskId AND tt.TagId = tg.TagId
	WHERE s.SprintId = @SprintId
	ORDER BY t.TaskId, tg.TagDescription

END
