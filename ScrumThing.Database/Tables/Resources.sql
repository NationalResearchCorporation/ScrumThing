CREATE TABLE Resources (
	ResourceId INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	SprintId INT,
	UserName VARCHAR(40), 
    DevPercentage FLOAT NULL,
    QsPercentage FLOAT NULL,
    [Days] FLOAT NULL,
    TotalDevHours FLOAT NULL,
    TotalQsHours FLOAT NULL,
    TotalHours FLOAT NULL,
    CONSTRAINT FK_Resources_SprintId_Sprint_SprintId FOREIGN KEY (SprintId) REFERENCES Sprints (SprintId),
    CONSTRAINT FK_Resources_UserName_User_UserName FOREIGN KEY (UserName) REFERENCES Users (UserName)
);
