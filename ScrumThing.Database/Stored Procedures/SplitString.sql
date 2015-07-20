-- TODO: replace this with standard fn_Split

CREATE FUNCTION dbo.SplitString (
    @Str nvarchar(4000), 
    @Separator char(1)
)
RETURNS TABLE
AS
RETURN (
    WITH Tokens(p, a, b) AS (
        SELECT 
            1, 
            1, 
            CHARINDEX(@Separator, @Str)
        UNION ALL
        SELECT
            p + 1, 
            b + 1, 
            charindex(@Separator, @Str, b + 1)
        FROM Tokens
        WHERE b > 0
    ),

    Splits AS (
        SELECT
            p-1 zeroBasedOccurance,
            SUBSTRING(
                @Str, 
                a, 
                CASE WHEN b > 0 THEN b-a ELSE 4000 END) 
            AS s
        FROM tokens)

    SELECT s
    FROM Splits
    WHERE s IS NOT NULL
)
GO
