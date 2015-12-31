
CREATE PROCEDURE GetSprints
	@TeamId INT
AS
BEGIN
	select 
		s.SprintId, 
		s.Name
	from 
		Sprints s left join SprintDays sd on
		s.SprintId = sd.SprintId
	where
		TeamId = @TeamId
	group by
		s.Name,
		s.SprintId
	order by
		max(sd.Day) desc,
		s.Name
END
