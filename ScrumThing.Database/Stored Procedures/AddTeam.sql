
CREATE PROCEDURE AddTeam
	@TeamId INT,
	@TeamName VARCHAR(100)
AS
BEGIN
	INSERT INTO Teams (TeamId, TeamName)
	VALUES (@TeamId, @TeamName);

    INSERT INTO TeamStoryTagSettings (TeamId, StoryTagId)
    SELECT @TeamId, StoryTagId
    FROM StoryTags

END
