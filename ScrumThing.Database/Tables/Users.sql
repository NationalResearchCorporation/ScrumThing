CREATE TABLE Users (
	UserName VARCHAR(40) NOT NULL PRIMARY KEY,
	Email VARCHAR(254) NULL, 
    [UserIdentity] VARCHAR(40) NOT NULL DEFAULT 'Unknown' , 
    CONSTRAINT [AK_Users_UserNameUserIdentity] UNIQUE ([UserName], [UserIdentity]), 
    CONSTRAINT [FK_Users_UserIdentities] FOREIGN KEY ([UserIdentity]) REFERENCES [UserIdentities]([UserIdentity])
);
