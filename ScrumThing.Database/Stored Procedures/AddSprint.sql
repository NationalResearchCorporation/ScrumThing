
CREATE PROCEDURE AddSprint
    @TeamId INT,
    @Name VARCHAR(200) = ''
AS
BEGIN
    BEGIN TRANSACTION

    INSERT INTO Sprints (TeamId, Name)
    VALUES (@TeamId, @Name);	

    IF @Name = ''
    BEGIN
        UPDATE Sprints
        SET Name = SCOPE_IDENTITY()
        WHERE SprintId = SCOPE_IDENTITY()
    END

    COMMIT

    RETURN SCOPE_IDENTITY()
END
