CREATE TABLE Tasks (
	TaskId INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	StoryId INT NOT NULL,
	TaskText VARCHAR(1000),
    [State] VARCHAR(20),
	EstimatedDevHours FLOAT NOT NULL,
	EstimatedQsHours FLOAT NOT NULL,
    DevHoursBurned FLOAT NOT NULL,
    QsHoursBurned FLOAT NOT NULL,
    RemainingDevHours FLOAT NOT NULL,
    RemainingQsHours FLOAT NOT NULL,
	Ordinal INT NOT NULL
)
