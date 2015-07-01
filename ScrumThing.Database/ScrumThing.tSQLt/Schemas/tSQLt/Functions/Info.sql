---Build+
CREATE FUNCTION tSQLt.Info()
RETURNS TABLE
AS
RETURN
SELECT
Version = '1.0.5325.27056',
ClrVersion = (SELECT tSQLt.Private::Info());
---Build-