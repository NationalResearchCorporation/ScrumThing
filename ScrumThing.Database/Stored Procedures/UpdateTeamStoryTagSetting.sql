
CREATE PROCEDURE UpdateTeamStoryTagSetting
    @TeamId INT,
    @StoryTagId INT,
    @Enabled BIT
AS
BEGIN
    UPDATE TeamStoryTagSettings
    SET Enabled = @Enabled
    WHERE TeamId = @TeamId AND StoryTagId = @StoryTagId
END
