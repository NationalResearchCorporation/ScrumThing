CREATE FUNCTION [dbo].[GetMinAndMaxValuesForTimeperiod]
(
    @TimeScale VARCHAR(6),
    @TimeStamp DATETIME,
    @SprintId INT
)
RETURNS @MinAndMaxTimeperiodValues TABLE
(
    MinTimeperiodValue DATETIME,
    MaxTimeperiodValue DATETIME
)
AS
BEGIN

    DECLARE @MinTimeperiodValue DATETIME = '1900-01-01 00:00:00.000'
    DECLARE @MaxTimeperiodValue DATETIME = '2999-12-31 23:59:59.997'

    IF @TimeScale = 'sprint'
    BEGIN
        DECLARE @SprintCount INT = (
            SELECT COUNT(1) FROM SprintDays 
            WHERE SprintId = @SprintId
        )

        IF @SprintCount > 0
        BEGIN
            SELECT @MinTimeperiodValue = MIN([Day]),
                   @MaxTimeperiodValue = MAX([Day])
            FROM SprintDays
            WHERE SprintId = @SprintId
            GROUP BY SprintId
        END
    END

    IF @TimeScale = 'week'
    BEGIN
        DECLARE @DayOfWeek INT = DATEPART(WEEKDAY, @TimeStamp)
        DECLARE @TimeStampSetToMidnight DATETIME = CAST(CAST(@TimeStamp AS DATE) AS DATETIME)
        
        DECLARE @EndOfNextSaturday DATETIME
        DECLARE @DaysUntilNextSunday INT = 8 - @DayOfWeek
        DECLARE @NextSundayAtMidnight DATETIME = DATEADD(DAY, @DaysUntilNextSunday, @TimeStampSetToMidnight)
        SET @EndOfNextSaturday = DATEADD(MILLISECOND, -2, @NextSundayAtMidnight)
        SET @MaxTimeperiodValue = @EndOfNextSaturday

        DECLARE @BeginningOfLastSunday DATETIME
        DECLARE @DaysSinceLastSunday INT = -1 * (@DayOfWeek - 1)
        SET @BeginningOfLastSunday = DATEADD(DAY, @DaysSinceLastSunday, @TimeStampSetToMidnight)
        SET @MinTimeperiodValue = @BeginningOfLastSunday
    END
        
    DECLARE @BeginningOfDay DATETIME

    IF @TimeScale = 'day'
    BEGIN
        SET @BeginningOfDay = CAST(CAST(@TimeStamp AS DATE) AS DATETIME)
        SET @MinTimeperiodValue = @BeginningOfDay

        DECLARE @EndOfDay DATETIME
        DECLARE @BeginningOfTomorrow DATETIME = DATEADD(DAY, 1, @BeginningOfDay)
        SET @EndOfDay = DATEADD(MILLISECOND, -2, @BeginningOfTomorrow)
        SET @MaxTimeperiodValue = @EndOfDay
    END
    

    IF @TimeScale = 'hour'
    BEGIN
        DECLARE @BeginningOfHour DATETIME
        DECLARE @Hour INT = DATEPART(HOUR, @TimeStamp)
        SET @BeginningOfDay = CAST(CAST(@TimeStamp AS DATE) AS DATETIME)
        SET @BeginningOfHour = DATEADD(HOUR, @Hour, @BeginningOfDay)
        SET @MinTimeperiodValue = @BeginningOfHour

        DECLARE @EndOfHour DATETIME
        DECLARE @BeginningOfNextHour DATETIME = DATEADD(HOUR, @Hour + 1, @BeginningOfDay)
        SET @EndOfHour = DATEADD(MILLISECOND, -2, @BeginningOfNextHour)
        SET @MaxTimeperiodValue = @EndOfHour
    END

    IF @TimeScale = 'minute'
    BEGIN
        DECLARE @BeginningOfMinute DATETIME
        SET @Hour = DATEPART(HOUR, @TimeStamp)
        DECLARE @Minute INT = DATEPART(MINUTE, @TimeStamp)
        SET @BeginningOfDay = CAST(CAST(@TimeStamp AS DATE) AS DATETIME)
        SET @BeginningOfMinute = DATEADD(MINUTE, @Hour * 60 + @Minute, @BeginningOfDay)
        SET @MinTimeperiodValue = @BeginningOfMinute

        DECLARE @EndOfMinute DATETIME
        DECLARE @BeginningOfNextMinute DATETIME = DATEADD(MINUTE, @Hour * 60 + @Minute + 1, @BeginningOfDay)
        SET @EndOfMinute = DATEADD(MILLISECOND, -2, @BeginningOfNextMinute)
        SET @MaxTimeperiodValue = @EndOfMinute
    END

    IF @TimeScale = 'none'
    BEGIN
        SET @MinTimeperiodValue = @TimeStamp
        SET @MaxTimeperiodValue = @TimeStamp
    END

    INSERT INTO @MinAndMaxTimeperiodValues (MinTimeperiodValue, MaxTimeperiodValue)
    VALUES (@MinTimeperiodValue, @MaxTimeperiodValue)

    RETURN

END