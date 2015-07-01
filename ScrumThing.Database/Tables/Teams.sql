CREATE TABLE [dbo].[Teams]
(
    [TeamId] INT NOT NULL PRIMARY KEY, 
    [TeamName] VARCHAR(100) NOT NULL,
    CONSTRAINT uc_TeamName UNIQUE ([TeamName])
)
