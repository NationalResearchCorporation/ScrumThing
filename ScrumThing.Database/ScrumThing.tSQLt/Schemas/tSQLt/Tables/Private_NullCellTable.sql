CREATE TABLE tSQLt.Private_NullCellTable(
  I INT 
);
GO
CREATE TRIGGER tSQLt.Private_NullCellTable_StopDeletes ON tSQLt.Private_NullCellTable INSTEAD OF DELETE, INSERT, UPDATE
AS
BEGIN
  RETURN;
END;