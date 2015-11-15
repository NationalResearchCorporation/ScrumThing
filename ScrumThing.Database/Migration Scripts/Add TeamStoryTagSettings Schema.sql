
-- PreDeployment

--ALTER TABLE StoryTags ADD Ordinal INT NULL

--; WITH RowNumbers AS (
--	SELECT StoryTagId, RowNumber = ROW_NUMBER() OVER (ORDER BY StoryTagId)
--	FROM StoryTags
--)

--UPDATE st
--SET Ordinal = RowNumber
--FROM StoryTags st
--JOIN RowNumbers rn ON st.StoryTagId = rn.StoryTagId

--ALTER TABLE StoryTags ALTER COLUMN Ordinal INT NOT NULL

-- PostDeployment

--INSERT INTO TeamStoryTagSettings (TeamId, StoryTagId)
--SELECT TeamId, StoryTagId
--FROM Teams
--CROSS JOIN StoryTags

SELECT *
FROM TeamStoryTagSettings
