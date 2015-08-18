CREATE FUNCTION [dbo].[GetTimeScaleWindowValue]
(
    @TimeScale VARCHAR(6),
    @SprintId INT,
    @BeginningOfTime DATETIME,
    @Timestamp DATETIME
)
RETURNS DECIMAL(19,10)
AS
BEGIN   
    RETURN 
        CASE @TimeScale
            WHEN 'sprint' THEN @SprintId
            WHEN 'week' THEN DATEDIFF(WEEK, @BeginningOfTime, @Timestamp)
            WHEN 'day' THEN DATEDIFF(DAY, @BeginningOfTime, @Timestamp)
            WHEN 'hour' THEN DATEDIFF(HOUR, @BeginningOfTime, @Timestamp)
            WHEN 'minute' THEN DATEDIFF(MINUTE, @BeginningOfTime, @Timestamp)
            WHEN 'none' THEN CONVERT(decimal(19,10), @Timestamp)
        END;
END