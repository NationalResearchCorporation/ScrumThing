CREATE SCHEMA GetPersonalActionLog AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'GetPersonalActionLog';
GO

CREATE PROCEDURE GetPersonalActionLog.Test_UserIdentityDoesntExist_ThrowsException
AS
BEGIN
    INSERT INTO Users 
        (UserName   , UserIdentity)
    VALUES 
        ('UserName1', 'UserIdentity1'),
        ('UserName2', NULL)

    EXEC tSQLt.ExpectException N'The user''s identity was not found in the database.'

    EXEC dbo.GetPersonalActionLog
        @UserIdentity = 'SomeIdentityThatDoesntExist',
        @FromTime = '2000-01-01',
        @ToTime = '2000-01-02',
        @TimeScale = 'none'
END
GO

CREATE PROCEDURE GetPersonalActionLog.Test_InvalidWindowSize_ThrowsException
AS
BEGIN
    INSERT INTO Users 
        (UserName   , UserIdentity)
    VALUES 
        ('UserName1', 'UserIdentity1')

    EXEC tSQLt.ExpectException N'The supplied time scale is invalid.'

    DECLARE @TimeScaleThatDoesntExist VARCHAR(5) = 'Flar';

    EXEC dbo.GetPersonalActionLog
        @UserIdentity = 'UserIdentity1',
        @FromTime = '2000-01-01',
        @ToTime = '2000-01-02',
        @TimeScale = @TimeScaleThatDoesntExist;
END
GO

CREATE PROCEDURE GetPersonalActionLog.Test_Normally_CalculatesBurnedDevHourDeltaCorrectly
AS
BEGIN

    EXEC tSQLt.FakeTable N'Users'  INSERT INTO Users (UserName, UserIdentity) VALUES ('User', 'User')
    EXEC tSQLt.FakeTable N'Sprints' INSERT INTO Sprints (SprintId, Name, TeamId) VALUES (1, 'Sprint', 1)
    EXEC tSQLt.FakeTable N'Assignments' INSERT INTO Assignments (UserName, TaskId) VALUES ('User', 1)
    EXEC tSQLt.FakeTable N'Teams' INSERT INTO Teams (TeamId, TeamName) VALUES (1, 'Team')

    EXEC tSQLt.FakeTable N'Stories' INSERT INTO Stories 
        (StoryId, StoryText, SprintId, StoryPoints, Ordinal, IsReachGoal) VALUES
        (1      , 'Story'  , 1       , 1          , 1      , 0          )

    EXEC tSQLt.FakeTable @TableName = N'Tasks', @Defaults = 1 INSERT INTO Tasks
        (TaskId, StoryId, EstimatedDevHours, RemainingDevHours, Ordinal) VALUES
        (1     , 1      , 5                , 5                , 1      )

    EXEC tSQLt.FakeTable @TableName = N'WorkLogs', @Defaults = 1 INSERT INTO WorkLogs
        (WorkLogId, LoggedBy, SprintId, TaskId, TaskDevHoursBurned, TaskRemainingDevHours, [Timestamp]              )   VALUES
        (1       ,  'User'  , 1       , 1     , 0                 , 5                    , '2015-01-02 00:00:00.000'),
        (2       ,  'User'  , 1       , 1     , 1                 , 5                    , '2015-01-02 06:00:00.000'),
        (3       ,  'User'  , 1       , 1     , 2                 , 5                    , '2015-01-02 06:00:00.000'),
        (4       ,  'User'  , 1       , 1     , 2                 , 4                    , '2015-01-02 06:00:00.000'),
        (5       ,  'User'  , 1       , 1     , 2                 , 3                    , '2015-01-02 12:00:00.000')

    CREATE TABLE ActualPalResult (
        MostRecentActivityLoggedBy VARCHAR(40),
        MostRecentTimestamp DATETIME,
        MinTimePeriodValue DATETIME,
        MaxTimePeriodValue DATETIME,
        TeamName VARCHAR(100),
        SprintId INT,
        SprintName VARCHAR(200),
        StoryOrdinal INT,
        StoryText VARCHAR(1000),
        IsReachGoal BIT,
        StoryPoints INT,
        TaskOrdinal INT,
        TaskText VARCHAR(1000),
        TaskState VARCHAR(20),
        EstimatedDevHours DECIMAL(9,4),
        EstimatedQsHours DECIMAL(9,4),
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        BurnedQsHours DECIMAL(9,4),
        BurnedQsHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
        RemainingQsHours DECIMAL(9,4),
        RemainingQsHourDelta DECIMAL(9,4)
    )

    INSERT INTO ActualPalResult
    EXEC GetPersonalActionLog
        @UserIdentity = N'User',
        @FromTime = '2015-01-01 00:00:00.000',
        @ToTime = '2015-01-03 00:00:00.000',
        @TimeScale = N'day'

    SELECT
        MostRecentTimeStamp,
        BurnedDevHours,
        BurnedDevHourDelta,
        RemainingDevHours,
        RemainingDevHourDelta
    INTO
        #ActualPartialPalResult
    FROM 
        ActualPalResult

    CREATE TABLE ExpectedPartialPalResult (
        MostRecentTimestamp DATETIME,
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
    )

    INSERT INTO ExpectedPartialPalResult
            (MostRecentTimestamp      , BurnedDevHours, BurnedDevHourDelta, RemainingDevHours, RemainingDevHourDelta )
    VALUES  ('2015-01-02 12:00:00.000', 2             , 2                 , 3                , -2                     )
     
    EXEC tSQLt.AssertEqualsTable N'ExpectedPartialPalResult', N'#ActualPartialPalResult'

END
GO

CREATE PROCEDURE GetPersonalActionLog.Test_LogsSpanningTimeframe_LogsProperly
AS
BEGIN

    EXEC tSQLt.FakeTable N'Users' INSERT INTO Users (UserName, UserIdentity) VALUES ('User', 'User')
    EXEC tSQLt.FakeTable N'Sprints' INSERT INTO Sprints (SprintId, Name, TeamId) VALUES (1, 'Sprint', 1)
    EXEC tSQLt.FakeTable N'Assignments' INSERT INTO Assignments (UserName, TaskId) VALUES ('User' ,1 )
    EXEC tSQLt.FakeTable N'Teams' INSERT INTO Teams (TeamId, TeamName) VALUES (1, 'Team')
    EXEC tSQLt.FakeTable N'Stories' INSERT INTO Stories
        (StoryId, StoryText, SprintId, StoryPoints, Ordinal, IsReachGoal) VALUES
        (1      , 'Story'  , 1       , 1          , 1      , 0          )

    EXEC tSQLt.FakeTable @TableName = N'Tasks', @Defaults = 1 INSERT INTO Tasks
        (TaskId, StoryId, EstimatedDevHours, RemainingDevHours, Ordinal) VALUES
        (1     , 1      , 5                , 5                , 1      )

    EXEC tSQLt.FakeTable @TableName = N'WorkLogs', @Defaults = 1 INSERT INTO WorkLogs
        (WorkLogId, LoggedBy, SprintId, TaskId, TaskDevHoursBurned, TaskRemainingDevHours, [Timestamp]              ) VALUES
        (1       ,  'User'  , 1       , 1     , 0                 , 5                    , '2015-01-02 00:00:00.000'),
        (2       ,  'User'  , 1       , 1     , 1                 , 5                    , '2015-01-02 00:00:00.000'),
        (3       ,  'User'  , 1       , 1     , 2                 , 5                    , '2015-01-03 00:00:00.000'),
        (4       ,  'User'  , 1       , 1     , 2                 , 4                    , '2015-01-03 00:00:00.000'),
        (5       ,  'User'  , 1       , 1     , 2                 , 3                    , '2015-01-04 00:00:00.000')

    CREATE TABLE ActualPalResult (
        MostRecentActivityLoggedBy VARCHAR(40),
        MostRecentTimestamp DATETIME,
        MinTimePeriodValue DATETIME,
        MaxTimePeriodValue DATETIME,
        TeamName VARCHAR(100),
        SprintId INT,
        SprintName VARCHAR(200),
        StoryOrdinal INT,
        StoryText VARCHAR(1000),
        IsReachGoal BIT,
        StoryPoints INT,
        TaskOrdinal INT,
        TaskText VARCHAR(1000),
        TaskState VARCHAR(20),
        EstimatedDevHours DECIMAL(9,4),
        EstimatedQsHours DECIMAL(9,4),
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        BurnedQsHours DECIMAL(9,4),
        BurnedQsHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
        RemainingQsHours DECIMAL(9,4),
        RemainingQsHourDelta DECIMAL(9,4)
    )

    INSERT INTO ActualPalResult
    EXEC GetPersonalActionLog
        @UserIdentity = N'User',
        @FromTime = '2015-01-01 00:00:00.000',
        @ToTime = '2015-01-05 00:00:00.000',
        @TimeScale = N'day'

    SELECT
        MostRecentTimeStamp,
        BurnedDevHours,
        BurnedDevHourDelta,
        RemainingDevHours,
        RemainingDevHourDelta
    INTO
        #ActualPartialPalResult
    FROM 
        ActualPalResult

    CREATE TABLE ExpectedPartialPalResult (
        MostRecentTimestamp DATETIME,
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
    )

    INSERT INTO ExpectedPartialPalResult 
            (MostRecentTimestamp      , BurnedDevHours, BurnedDevHourDelta, RemainingDevHours, RemainingDevHourDelta ) VALUES 
            ('2015-01-02 00:00:00.000', 1             , 1                 , 5                , 0                     ),
            -- The burnedDevHourDelta for 1/3 is 1 because 1 hour was burned between the 2nd and 3rd.
            ('2015-01-03 00:00:00.000', 2             , 1                 , 4                , -1                    ),
            ('2015-01-04 00:00:00.000', 2             , 0                 , 3                , -1                    )
     
    EXEC tSQLt.AssertEqualsTable N'ExpectedPartialPalResult', N'#ActualPartialPalResult'

END
GO

CREATE PROCEDURE GetPersonalActionLog.Test_LogTruncatedByTimeframe_LogsProperly
AS
BEGIN
    EXEC tSQLt.FakeTable N'Users' INSERT INTO Users (UserName, UserIdentity) VALUES ('User', 'User')
    EXEC tSQLt.FakeTable N'Sprints' INSERT INTO Sprints (SprintId, Name, TeamId) VALUES (1, 'Sprint', 1)
    EXEC tSQLt.FakeTable N'Assignments' INSERT INTO Assignments (UserName, TaskId) VALUES ('User' ,1 )
    EXEC tSQLt.FakeTable N'Teams' INSERT INTO Teams (TeamId, TeamName) VALUES (1, 'Team')
    EXEC tSQLt.FakeTable N'Stories' INSERT INTO Stories
        (StoryId, StoryText, SprintId, StoryPoints, Ordinal, IsReachGoal) VALUES
        (1      , 'Story'  , 1       , 1          , 1      , 0          )

    EXEC tSQLt.FakeTable @TableName = N'Tasks', @Defaults = 1 INSERT INTO Tasks
        (TaskId, StoryId, EstimatedDevHours, RemainingDevHours, Ordinal) VALUES
        (1     , 1      , 5                , 5                , 1      )

    EXEC tSQLt.FakeTable @TableName = N'WorkLogs', @Defaults = 1 INSERT INTO WorkLogs
        (WorkLogId, LoggedBy, SprintId, TaskId, TaskDevHoursBurned, TaskRemainingDevHours, [Timestamp]              ) VALUES
        (1       ,  'User'  , 1       , 1     , 0                 , 5                    , '2015-01-02 00:00:00.000'),
        (2       ,  'User'  , 1       , 1     , 1                 , 5                    , '2015-01-02 00:00:00.000'),
        (3       ,  'User'  , 1       , 1     , 2                 , 5                    , '2015-01-03 00:00:00.000'),
        (4       ,  'User'  , 1       , 1     , 2                 , 4                    , '2015-01-03 00:00:00.000'),
        (5       ,  'User'  , 1       , 1     , 2                 , 3                    , '2015-01-04 00:00:00.000')

    CREATE TABLE ActualPalResult (
        MostRecentActivityLoggedBy VARCHAR(40),
        MostRecentTimestamp DATETIME,
        MinTimePeriodValue DATETIME,
        MaxTimePeriodValue DATETIME,
        TeamName VARCHAR(100),
        SprintId INT,
        SprintName VARCHAR(200),
        StoryOrdinal INT,
        StoryText VARCHAR(1000),
        IsReachGoal BIT,
        StoryPoints INT,
        TaskOrdinal INT,
        TaskText VARCHAR(1000),
        TaskState VARCHAR(20),
        EstimatedDevHours DECIMAL(9,4),
        EstimatedQsHours DECIMAL(9,4),
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        BurnedQsHours DECIMAL(9,4),
        BurnedQsHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
        RemainingQsHours DECIMAL(9,4),
        RemainingQsHourDelta DECIMAL(9,4)
    )

    INSERT INTO ActualPalResult
    EXEC GetPersonalActionLog
        @UserIdentity = N'User',
        @FromTime = '2015-01-03 00:00:00.000',
        @ToTime = '2015-01-03 00:00:00.000',
        @TimeScale = N'day'

    SELECT
        MostRecentTimeStamp,
        BurnedDevHours,
        BurnedDevHourDelta,
        RemainingDevHours,
        RemainingDevHourDelta
    INTO
        #ActualPartialPalResult
    FROM 
        ActualPalResult

    CREATE TABLE ExpectedPartialPalResult (
        MostRecentTimestamp DATETIME,
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
    )

    INSERT INTO ExpectedPartialPalResult 
            (MostRecentTimestamp      , BurnedDevHours, BurnedDevHourDelta, RemainingDevHours, RemainingDevHourDelta ) VALUES 
            ('2015-01-03 00:00:00.000', 2             , 1                 , 4                , -1                    )
     
    EXEC tSQLt.AssertEqualsTable N'ExpectedPartialPalResult', N'#ActualPartialPalResult'
END
GO

CREATE PROCEDURE GetPersonalActionLog.Test_TimeWindowIsHours_LogsProperly
AS
BEGIN

    EXEC tSQLt.FakeTable N'Users'  INSERT INTO Users (UserName, UserIdentity) VALUES ('User', 'User')
    EXEC tSQLt.FakeTable N'Sprints' INSERT INTO Sprints (SprintId, Name, TeamId) VALUES (1, 'Sprint', 1)
    EXEC tSQLt.FakeTable N'Assignments' INSERT INTO Assignments (UserName, TaskId) VALUES ('User', 1)
    EXEC tSQLt.FakeTable N'Teams' INSERT INTO Teams (TeamId, TeamName) VALUES (1, 'Team')

    EXEC tSQLt.FakeTable N'Stories' INSERT INTO Stories 
        (StoryId, StoryText, SprintId, StoryPoints, Ordinal, IsReachGoal) VALUES
        (1      , 'Story'  , 1       , 1          , 1      , 0          )

    EXEC tSQLt.FakeTable @TableName = N'Tasks', @Defaults = 1 INSERT INTO Tasks
        (TaskId, StoryId, EstimatedDevHours, RemainingDevHours, Ordinal) VALUES
        (1     , 1      , 5                , 5                , 1      )

    EXEC tSQLt.FakeTable @TableName = N'WorkLogs', @Defaults = 1 INSERT INTO WorkLogs
        (WorkLogId, LoggedBy, SprintId, TaskId, TaskDevHoursBurned, TaskRemainingDevHours, [Timestamp]              )   VALUES
        (1       ,  'User'  , 1       , 1     , 0                 , 5                    , '2015-01-02 00:00:00.000'),
        (2       ,  'User'  , 1       , 1     , 1                 , 5                    , '2015-01-02 06:00:00.000'),
        (3       ,  'User'  , 1       , 1     , 2                 , 5                    , '2015-01-02 06:00:00.000'),
        (4       ,  'User'  , 1       , 1     , 2                 , 4                    , '2015-01-02 06:00:00.000'),
        (5       ,  'User'  , 1       , 1     , 2                 , 3                    , '2015-01-02 12:00:00.000')

    CREATE TABLE ActualPalResult (
        MostRecentActivityLoggedBy VARCHAR(40),
        MostRecentTimestamp DATETIME,
        MinTimePeriodValue DATETIME,
        MaxTimePeriodValue DATETIME,
        TeamName VARCHAR(100),
        SprintId INT,
        SprintName VARCHAR(200),
        StoryOrdinal INT,
        StoryText VARCHAR(1000),
        IsReachGoal BIT,
        StoryPoints INT,
        TaskOrdinal INT,
        TaskText VARCHAR(1000),
        TaskState VARCHAR(20),
        EstimatedDevHours DECIMAL(9,4),
        EstimatedQsHours DECIMAL(9,4),
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        BurnedQsHours DECIMAL(9,4),
        BurnedQsHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
        RemainingQsHours DECIMAL(9,4),
        RemainingQsHourDelta DECIMAL(9,4)
    )

    INSERT INTO ActualPalResult
    EXEC GetPersonalActionLog
        @UserIdentity = N'User',
        @FromTime = '2015-01-01 00:00:00.000',
        @ToTime = '2015-01-03 00:00:00.000',
        @TimeScale = N'hour'

    SELECT
        MostRecentTimeStamp,
        BurnedDevHours,
        BurnedDevHourDelta,
        RemainingDevHours,
        RemainingDevHourDelta
    INTO
        #ActualPartialPalResult
    FROM 
        ActualPalResult

    CREATE TABLE ExpectedPartialPalResult (
        MostRecentTimestamp DATETIME,
        BurnedDevHours DECIMAL(9,4),
        BurnedDevHourDelta DECIMAL(9,4),
        RemainingDevHours DECIMAL(9,4),
        RemainingDevHourDelta DECIMAL(9,4),
    )

    INSERT INTO ExpectedPartialPalResult
        (MostRecentTimestamp      , BurnedDevHours, BurnedDevHourDelta, RemainingDevHours, RemainingDevHourDelta ) VALUES
        ('2015-01-02 00:00:00.000', 0             , 0                 , 5                , 0                     ),
        ('2015-01-02 06:00:00.000', 2             , 2                 , 4                , -1                    ),
        ('2015-01-02 12:00:00.000', 2             , 0                 , 3                , -1                    )
     
    EXEC tSQLt.AssertEqualsTable N'ExpectedPartialPalResult', N'#ActualPartialPalResult'

END
GO