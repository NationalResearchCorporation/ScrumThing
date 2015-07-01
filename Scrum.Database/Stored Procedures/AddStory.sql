
CREATE PROCEDURE AddStory
    @SprintId INT
AS
BEGIN
    DECLARE @Ordinal INT = (SELECT COALESCE(MAX(Ordinal) + 1, 1)
                            FROM Stories
                            WHERE SprintId = @SprintId);

    INSERT INTO Stories
    (SprintId, StoryText, StoryPoints, Ordinal, IsReachGoal)
    VALUES
    (@SprintId, '', '', @Ordinal, 0);

    SELECT StoryId, Ordinal, IsReachGoal
    FROM Stories
    WHERE StoryId = SCOPE_IDENTITY();
END
