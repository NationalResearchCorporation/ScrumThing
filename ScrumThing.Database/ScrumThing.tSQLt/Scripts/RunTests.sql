-- This script is included for convenience.
-- This is not executed as part of the deployment process, because it is handled by the build process on TC.

USE ScrumTool_tSQLt
GO

EXEC tSQLt.RunAll;
--EXEC tSQLt.Run '[GetPersonalActionLog].[Test_LogsSpanningTimeframe_LogsProperly]';