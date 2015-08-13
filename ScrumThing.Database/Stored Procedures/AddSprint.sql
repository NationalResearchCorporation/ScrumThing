
CREATE PROCEDURE AddSprint
    @TeamId INT,
    @Name VARCHAR(200)
AS
BEGIN
    INSERT INTO Sprints (TeamId, Name)
    VALUES (@TeamId, @Name);	

    RETURN SCOPE_IDENTITY()
END
