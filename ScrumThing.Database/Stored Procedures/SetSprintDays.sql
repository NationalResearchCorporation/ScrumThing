
CREATE PROCEDURE SetSprintDays
    @SprintId INT,
    @Days VARCHAR(MAX)
AS
BEGIN

    BEGIN TRANSACTION

    DELETE FROM SprintDays
    WHERE SprintId = @SprintId

    INSERT INTO SprintDays
    (SprintId, [Day])
    SELECT @SprintId, s
    FROM SplitString(@Days, '|');

    COMMIT

END
