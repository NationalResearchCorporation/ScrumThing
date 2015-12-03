
CREATE PROCEDURE GetStoryTags
    @TeamId INT
AS
BEGIN
    SELECT
        st.StoryTagId,
        st.StoryTagDescription,
        st.Ordinal,
        tsts.[Enabled]
    FROM dbo.StoryTags st
    JOIN dbo.TeamStoryTagSettings tsts ON st.StoryTagId = tsts.StoryTagId
    WHERE tsts.teamId = @TeamId
END
