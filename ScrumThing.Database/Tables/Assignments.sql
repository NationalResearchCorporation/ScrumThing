
CREATE TABLE Assignments (
	UserName VARCHAR(40) NOT NULL,
	TaskId INT NOT NULL,
    CONSTRAINT FK_Assignments_UserName_Users_UserName FOREIGN KEY (UserName) REFERENCES Users (UserName),
    CONSTRAINT FK_Assignments_TaskId_Tasks_TaskId FOREIGN KEY (TaskId) REFERENCES Tasks (TaskId)
);
