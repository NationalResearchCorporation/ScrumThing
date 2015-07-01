---Build+
CREATE TABLE tSQLt.Private_RenamedObjectLog (
  Id INT IDENTITY(1,1) CONSTRAINT PK__Private_RenamedObjectLog__Id PRIMARY KEY CLUSTERED,
  ObjectId INT NOT NULL,
  OriginalName NVARCHAR(MAX) NOT NULL
);
---Build-