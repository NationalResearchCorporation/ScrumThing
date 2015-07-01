CREATE FUNCTION [dbo].[SafeDivide]
(
    @Divisor FLOAT,
    @Dividend FLOAT
)
RETURNS FLOAT
AS
BEGIN
    RETURN CASE @Dividend WHEN 0 THEN 0 ELSE @Divisor / @Dividend END
END