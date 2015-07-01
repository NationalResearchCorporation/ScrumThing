
CREATE PROCEDURE GetTeams
AS
BEGIN
    SELECT
        TeamId,
        TeamName
    FROM Teams;
END
