CREATE PROCEDURE tSQLt.XmlResultFormatter
AS
BEGIN
    DECLARE @XmlOutput XML;

    SELECT @XmlOutput = (
      SELECT Tag, Parent, [testsuites!1!hide!hide], [testsuite!2!name], [testsuite!2!tests], [testsuite!2!errors], [testsuite!2!failures], [testcase!3!classname], [testcase!3!name], [failure!4!message]  FROM (
        SELECT 1 AS Tag,
               NULL AS Parent,
               'root' AS [testsuites!1!hide!hide],
               NULL AS [testsuite!2!name],
               NULL AS [testsuite!2!tests],
               NULL AS [testsuite!2!errors],
               NULL AS [testsuite!2!failures],
               NULL AS [testcase!3!classname],
               NULL AS [testcase!3!name],
               NULL AS [failure!4!message]
        UNION ALL
        SELECT 2 AS Tag, 
               1 AS Parent,
               'root',
               Class AS [testsuite!2!name],
               COUNT(1) AS [testsuite!2!tests],
               SUM(CASE Result WHEN 'Error' THEN 1 ELSE 0 END) AS [testsuite!2!errors],
               SUM(CASE Result WHEN 'Failure' THEN 1 ELSE 0 END) AS [testsuite!2!failures],
               NULL AS [testcase!3!classname],
               NULL AS [testcase!3!name],
               NULL AS [failure!4!message]
          FROM tSQLt.TestResult
        GROUP BY Class
        UNION ALL
        SELECT 3 AS Tag,
               2 AS Parent,
               'root',
               Class,
               NULL,
               NULL,
               NULL,
               Class,
               TestCase,
               NULL
          FROM tSQLt.TestResult
        UNION ALL
        SELECT 4 AS Tag,
               3 AS Parent,
               'root',
               Class,
               NULL,
               NULL,
               NULL,
               Class,
               TestCase,
               Msg
          FROM tSQLt.TestResult
         WHERE Result IN ('Failure', 'Error')) AS X
       ORDER BY [testsuite!2!name], [testcase!3!name], Tag
       FOR XML EXPLICIT
       );

    EXEC tSQLt.Private_PrintXML @XmlOutput;
END;