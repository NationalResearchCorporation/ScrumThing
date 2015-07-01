-- Template for creating new unit tests with tSQLt
--
-- To get started, Find and Replace all instances of <unit_name> - name of unit to be tested, e.g. "dbo_fn_GetEndDate"

-- create a test schema for this unit
CREATE SCHEMA <unit_name> AUTHORIZATION [dbo];
GO

EXECUTE sp_addextendedproperty @name = N'tSQLt.TestClass', @value = 1, @level0type = N'SCHEMA', @level0name = N'<unit_name>';
GO

-- this method is run before every test case and rolled back afterwards
CREATE PROCEDURE <unit_name>.SetUp
AS
BEGIN
    EXEC tSQLt.FakeTable @TableName = N'SomeTable', @SchemaName = N'dbo'
    INSERT INTO dbo.SomeTable (SomeTableID, SomeFact)
    VALUES (1,1),(2,2),(3,3),(4,4)
END
GO

-- add test cases here
CREATE PROCEDURE <unit_name>.Test_<conditions>_<results>
AS
BEGIN
    -- insert test here
    EXEC tSQLt.Fail
END
GO