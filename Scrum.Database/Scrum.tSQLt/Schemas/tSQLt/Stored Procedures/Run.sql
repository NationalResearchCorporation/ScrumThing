CREATE PROCEDURE tSQLt.Run
   @TestName NVARCHAR(MAX) = NULL
AS
BEGIN
  DECLARE @TestResultFormatter NVARCHAR(MAX);
  SELECT @TestResultFormatter = tSQLt.GetTestResultFormatter();
  
  EXEC tSQLt.Private_Run @TestName, @TestResultFormatter;
END;