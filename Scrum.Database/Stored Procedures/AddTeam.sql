
CREATE PROCEDURE AddTeam
	@TeamId INT,
	@TeamName VARCHAR(100)
AS
BEGIN
	INSERT INTO Teams (TeamId, TeamName)
	VALUES (@TeamId, @TeamName);
END
