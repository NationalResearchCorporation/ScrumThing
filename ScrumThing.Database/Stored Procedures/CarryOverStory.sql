CREATE PROCEDURE [dbo].[CarryOverStory]
    @StoryID int,
    @SprintID int
AS
    BEGIN TRANSACTION

    DECLARE @counter INT = 1;
    DECLARE @ordinal INT;
    DECLARE @newStoryID INT;
    DECLARE @storyText VARCHAR(1000);
    DECLARE @storyPoints INT;
    DECLARE @storyTags VARCHAR(MAX);
    DECLARE @isReachGoal BIT = 0;
	DECLARE @title VARCHAR(100);
 
    -- Get source story data
    SELECT 
        @storyText = StoryText, 
        @storyPoints = StoryPoints,
        @storyTags = 
	        STUFF((SELECT '|' + CAST(StoryTagId as VARCHAR(10))
	        FROM StoriesInTags st
	        WHERE st.StoryID = s.StoryID
	        FOR XML PATH('')), 1, 1, ''),
		@title = Title
    FROM Stories s
    WHERE StoryId = @StoryID 
    
    SELECT @ordinal = ISNULL(MAX(Ordinal), 0) + 1 FROM Stories WHERE SprintID = @SprintID

    -- Create new story
    EXEC @newStoryID = dbo.AddStory @SprintID, @ordinal, @isReachGoal
	    
    EXEC dbo.UpdateStory @newStoryID, @storyText, @storyPoints, @isReachGoal, @title

    IF @storyTags IS NOT NULL
        EXEC dbo.SetStoryTags @newStoryID, @storyTags
 
    -- Copy tasks now
    CREATE TABLE #tasks(
    RowID              INT,
    TaskText           VARCHAR(1000),
    RemainingDevHours  FLOAT,
    RemainingQsHours   FLOAT,
    TaskTags           VARCHAR(MAX))

    CREATE TABLE #taskOrdinal (
    TaskID	INT, 
    Ordinal INT);

    -- Get source tasks data
    WITH CandidateTasks AS
	    (SELECT 
		    RowID = ROW_NUMBER() OVER (ORDER BY TaskText), 
		    TaskID, 
		    TaskText, 
		    RemainingDevHours, 
		    RemainingQsHours 
	    FROM Tasks 
	    WHERE 
		    StoryID = @StoryID
		    AND [State] != 'Complete'
		    AND (RemainingDevHours > 0 OR RemainingQsHours > 0))

    INSERT INTO #tasks
    SELECT 
	    c.RowID, 
	    TaskText, 
	    RemainingDevHours, 
	    RemainingQsHours, 
	    [Tags] = STUFF(
		    (SELECT '|' + CAST(TaskTagId AS VARCHAR(10)) 
		    FROM TasksInTags t 
		    WHERE TaskID = c.TaskID
		    FOR XML PATH('')), 1, 1, '')
    FROM CandidateTasks c

    
    DECLARE @taskText VARCHAR(1000);
    DECLARE @remainingDevHours FLOAT;
    DECLARE @remainingQsHours FLOAT;
    DECLARE @taskTags VARCHAR(MAX);
    DECLARE @defaultLoggedBy VARCHAR(40) = 'system';
    DECLARE @defaultState VARCHAR(20) = 'ReadyForDev';

    WHILE ((SELECT MAX(RowID) FROM #tasks) >= @Counter)
        BEGIN
            DECLARE @newTaskID INT
            DELETE FROM #taskOrdinal

            INSERT #taskOrdinal 
            EXEC dbo.AddTask @defaultLoggedBy, @newStoryID;

            SELECT @newTaskID = TaskId FROM #taskOrdinal

            SELECT @TaskText = TaskText,
                    @remainingDevHours = RemainingDevHours,
                    @remainingQsHours = RemainingQsHours,
                    @taskTags = TaskTags 
            FROM #tasks 
            WHERE RowID = @counter

            EXEC dbo.UpdateTask @defaultLoggedBy, @newTaskID, @taskText, @defaultState, @remainingDevHours, @remainingQsHours, 0, 0, @remainingDevHours, @remainingQsHours, @taskTags;

            SET @counter = @counter + 1
        END

    SELECT StoryId, Ordinal, IsReachGoal
    FROM Stories
    WHERE SprintId = @SprintId;
    
    COMMIT

