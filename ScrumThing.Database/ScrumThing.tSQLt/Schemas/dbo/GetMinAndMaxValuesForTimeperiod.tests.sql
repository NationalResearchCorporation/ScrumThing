CREATE SCHEMA GetMinAndMaxValuesForTimeperiod AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'GetMinAndMaxValuesForTimeperiod';
GO
---------------------------------------------------------------------------------------------------
-- Timescale: Sprint
---------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsSprint_SetsValuesToExtentsOfSprint
AS
BEGIN
    
    EXEC tSQLt.FakeTable N'SprintDays'
    INSERT INTO SprintDays ([SprintId], [Day])
    VALUES  (1, '2015-01-01'), (1, '2015-01-05')

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('2015-01-01', '2015-01-05')

    DECLARE @TimeScale VARCHAR(6) = 'sprint'
    DECLARE @NotApplicable DATETIME = NULL
    DECLARE @SprintId INT = 1

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @NotApplicable, @SprintId)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsSprintThatDoesntExist_SetsValuesToBeginningAndEndOfTime
AS
BEGIN

    EXEC tSQLt.FakeTable N'SprintDays'
    INSERT INTO SprintDays ([SprintId], [Day])
    VALUES  (1, '2015-01-01'), (1, '2015-01-05')

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('1900-01-01 00:00:00.000', '2999-12-31 23:59:59.997')

    DECLARE @TimeScale VARCHAR(6) = 'sprint'
    DECLARE @NotApplicable DATETIME = NULL
    DECLARE @SprintIdThatDoesntExist INT = 2

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @NotApplicable, @SprintIdThatDoesntExist)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO

---------------------------------------------------------------------------------------------------
-- Timescale: Week
---------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsWeek_SetsValuesToBeginningAndEndingOfWeek
AS
BEGIN

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('2014-12-28 00:00:00.000', '2015-01-03 23:59:59.997') --Sunday through Saturday

    DECLARE @TimeScale VARCHAR(6) = 'week'
    DECLARE @TimeStamp DATETIME = '2015-01-01'
    DECLARE @NotApplicable INT = NULL

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @TimeStamp, @NotApplicable)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO
---------------------------------------------------------------------------------------------------
-- Timescale: Day
---------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsDay_SetsValuesToBeginningAndEndingOfDay
AS
BEGIN

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('2014-12-28 00:00:00.000', '2014-12-28 23:59:59.997')

    DECLARE @TimeScale VARCHAR(6) = 'day'
    DECLARE @TimeStamp DATETIME = '2014-12-28 11:11:11.111'
    DECLARE @NotApplicable INT = NULL

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @TimeStamp, @NotApplicable)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO

---------------------------------------------------------------------------------------------------
-- Timescale: Hour
---------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsHour_SetsValuesToBeginningAndEndingOfHour
AS
BEGIN

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('2014-12-28 11:00:00.000', '2014-12-28 11:59:59.997')

    DECLARE @TimeScale VARCHAR(6) = 'hour'
    DECLARE @TimeStamp DATETIME = '2014-12-28 11:11:11.111'
    DECLARE @NotApplicable INT = NULL

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @TimeStamp, @NotApplicable)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO    

---------------------------------------------------------------------------------------------------
-- Timescale: Minute
---------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsMinute_SetsValuesToBeginningAndEndingOfMinute
AS
BEGIN

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('2014-12-28 11:11:00.000', '2014-12-28 11:11:59.997')

    DECLARE @TimeScale VARCHAR(6) = 'minute'
    DECLARE @TimeStamp DATETIME = '2014-12-28 11:11:11.111'
    DECLARE @NotApplicable INT = NULL

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @TimeStamp, @NotApplicable)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO    

---------------------------------------------------------------------------------------------------
-- Timescale: None
---------------------------------------------------------------------------------------------------

CREATE PROCEDURE GetMinAndMaxValuesForTimeperiod.Test_TimeScale_IsNone_SetsBeginningAndEndingValuesToTimestamp
AS
BEGIN

    CREATE TABLE ExpectedResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ExpectedResult (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES ('2014-12-28 11:11:11.111', '2014-12-28 11:11:11.111')

    DECLARE @TimeScale VARCHAR(6) = 'none'
    DECLARE @TimeStamp DATETIME = '2014-12-28 11:11:11.111'
    DECLARE @NotApplicable INT = NULL

    CREATE TABLE ActualResult (MinTimeperiodValue DATETIME, MaxTimeperiodValue DATETIME)
    INSERT INTO ActualResult (MinTimeperiodValue, MaxTimeperiodValue)
    SELECT MinTimeperiodValue, MaxTimeperiodValue
    FROM dbo.GetMinAndMaxValuesForTimeperiod(@TimeScale, @TimeStamp, @NotApplicable)

    EXEC tSQLt.AssertEqualsTable N'ExpectedResult', N'ActualResult'

END
GO    