PRINT 'Configuring server and db settings for tSQLt.'

EXEC sp_configure 'clr enabled', 1;
RECONFIGURE;

DECLARE @cmd NVARCHAR(MAX);
SET @cmd='ALTER DATABASE ' + QUOTENAME(DB_NAME()) + ' SET TRUSTWORTHY ON;';
EXEC(@cmd);
GO

ALTER AUTHORIZATION ON DATABASE::$(DatabaseName) TO sa
GO