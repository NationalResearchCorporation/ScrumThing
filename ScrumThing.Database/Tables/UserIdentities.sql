CREATE TABLE [dbo].[UserIdentities]
(
    [UserIdentity] VARCHAR(40) NOT NULL PRIMARY KEY, 
    [FirstName] VARCHAR(50) NOT NULL DEFAULT 'Unknown', 
    [LastName] VARCHAR(50) NOT NULL DEFAULT 'Unknown' 
)
