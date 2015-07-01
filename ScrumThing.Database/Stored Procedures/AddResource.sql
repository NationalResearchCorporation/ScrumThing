
CREATE PROCEDURE AddResource
    @SprintId INT,
    @UserName VARCHAR(40),
    @DevPercentage FLOAT,
    @QsPercentage FLOAT,
    @Days FLOAT,
    @TotalDevHours FLOAT,
    @TotalQsHours FLOAT,
    @TotalHours FLOAT
AS
BEGIN
    BEGIN TRANSACTION
    
    IF NOT EXISTS(SELECT 1 FROM Users WHERE UserName = @UserName)
    BEGIN
        INSERT INTO Users (UserName) VALUES (@UserName);
    END

    INSERT INTO Resources
    (SprintId, UserName, DevPercentage, QsPercentage, [Days], TotalDevHours, TotalQsHours, TotalHours)
    VALUES
    (@SprintId, @UserName, @DevPercentage, @QsPercentage, @Days, @TotalDevHours, @TotalQsHours, @TotalHours);

    COMMIT
END
