:r ./TaskTags.sql
:r ./StoryTags.sql

UPDATE Users
SET UserIdentity = 'NRC\jcolasurdo'
WHERE UserName IN ('Joe', 'Joe Colasurdo');