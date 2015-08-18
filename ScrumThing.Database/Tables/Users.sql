CREATE TABLE Users (
	UserName VARCHAR(40) NOT NULL PRIMARY KEY,
	Email VARCHAR(254) NULL, 
    [UserIdentity] VARCHAR(40) NULL, 
    CONSTRAINT [AK_Users_UserNameUserIdentity] UNIQUE ([UserName], [UserIdentity]),
);
