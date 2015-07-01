CREATE TABLE [dbo].[Tags] (
    [TagId]          INT         NOT NULL,
    [TagDescription] VARCHAR(50) NULL,
    [TagClasses]     VARCHAR(50) NULL,
    CONSTRAINT [PK_TaskSettings] PRIMARY KEY CLUSTERED ([TagId] ASC)
);

