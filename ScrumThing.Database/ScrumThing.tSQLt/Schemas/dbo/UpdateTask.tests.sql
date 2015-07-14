CREATE SCHEMA UpdateTask AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'UpdateTask';
GO

CREATE PROCEDURE UpdateTask.test_Successful_UpdateState
AS
BEGIN
    EXEC testScrumThing.SetupTests;

	DECLARE @TaskId INT,
			@TaskText VARCHAR(1000),
			@State VARCHAR(20),
			@EstimatedDevHours FLOAT,
			@EstimatedQsHours FLOAT,
			@DevHoursBurned FLOAT,
			@QsHoursBurned FLOAT,
			@RemainingDevHours FLOAT,
			@RemainingQsHours FLOAT,
			@TaskTags VARCHAR(MAX)

	SELECT  @TaskId = TaskId,  
			@TaskText = TaskText,  
			@State = [State],  
			@EstimatedDevHours = EstimatedDevHours,  
			@EstimatedQsHours = EstimatedQsHours, 
			@DevHoursBurned = DevHoursBurned,  
			@QsHoursBurned = QsHoursBurned,  
			@RemainingDevHours = RemainingDevHours,  
			@RemainingQsHours = RemainingQsHours,
			@TaskTags = ''
	FROM Tasks
	WHERE TaskId = 1

	DECLARE @NewState VARCHAR(20) = 'ReadyForQs';

	EXEC UpdateTask @TaskId, @TaskText, @NewState, @EstimatedDevHours, @EstimatedQsHours, @DevHoursBurned, @QsHoursBurned, @RemainingDevHours, @RemainingQsHours, @TaskTags
	
	DECLARE @ActualState VARCHAR(20);
	SELECT  @ActualState = [State] FROM Tasks WHERE TaskId = 1

	EXEC tSQLt.AssertEqualsString @NewState, @ActualState;
END
GO