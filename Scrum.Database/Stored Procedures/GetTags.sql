CREATE PROCEDURE GetTags
AS
BEGIN
	SELECT
		TagId,
		TagDescription,
		TagClasses
	FROM dbo.Tags;
END
