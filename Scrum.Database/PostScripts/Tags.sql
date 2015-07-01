IF (NOT EXISTS( SELECT TOP 1 * FROM dbo.Tags ))
BEGIN

	INSERT INTO dbo.Tags( TagId, TagDescription, TagClasses)
	VALUES
	( 1 , 'Paired Programming', 'label label-info'),
	( 2 , 'Timeboxed', 'label label-danger')

END