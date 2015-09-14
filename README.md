# ScrumThing
ScrumThing is a virtual cardwall dedicated to keeping things simple.  It offers powerful features carefully packaged into a seamless user experience.  This keeps your sprint focused on the work at hand instead of managing spreadsheets or complex online tools.

And we don't just talk the talk.  We already have multiple teams using ScrumThing as our primary Agile tool.  We, as National Research Corporation, are strongly invested in keeping ScrumThing an an excellent tool for keeping teams in sync.

## Features
ScrumThing has everything you need to plan and execute a sprint.  However, we've carefully avoided loading it down with extra bells and whistles.

### Sprint Planning
Start your planning by using the calendar to choose which days your sprint will cover.  You can choose day-by-day for full control over how to handle holidays and weekends.

The resourcing tab allows you to calculate how many hours will be available during this sprint.  Dev and QS hours are tracked separately.

Now, you are ready to build out the stories and tasks that will make up the sprint.  Give them descriptions, estimate their points and hours, and drag and drop them into any order you'd like.

Any stories that don't fit into the sprint can be converted into reach goals.  These won't count against the burn down and they allow the team to pick up work quickly if they get ahead in the sprint.

Finally, stories and tasks can be marked with tags.  These can give important indications to team members like "Keep this work timeboxed" or "Ensure this receives pair programming."
 
### Sprint Execution
Now that you have planned your sprint, you are ready to begin work!  A virtual cardwall is populated with all of the stories and tasks.  Drag, drop, expand, and collapse them to keep up to date on the sprint's progress.

Click on any task to bring up the task's status.  From here, you can track who is working on it, how many hours have been burned, how many hours are remaining, and add comments.

### Reports
There are two important graphs built for looking at the state of your sprint as a whole: the traditional burndown, and "estimates vs actuals."

The burndown rolls up how much work has been done against the projected ideal, giving a sense of where the sprint is headed.

The "estimates vs actuals" page is a key tool for ScrumMasters looking to see where the stories actually landed compared to planning.

## Screenshots
- Plan sprint
- View sprint
- Burndown
- Estimates vs Actuals

## Deployment
So you're ready to use ScrumThing?  Here's everything you need to set it up.

### Website
Deploy the ScrumThing.Web to an IIS instance.  Then configure the Web.config's connection string for the database deployment below.  You will also need to update the highcharts license status key described below.

### Database
Deploy ScrumThing.Database to a SQL Server instance.  While we continue to work on administrative tools, you'll need to set up teams and tags manually in the database.

To create a team, execute the following SQL on the database:
```
    EXEC AddTeam 1, 'YourTeam'
```

To add tags for stories:
```
    INSERT INTO StoryTags (StoryTagId, StoryTagDescription)
    VALUES (1, 'YourStoryTag')
```

To add tags for tasks:
```
    INSERT INTO TaskTags (TaskTagId, TaskTagDescription)
    VALUES (1, 'YourTaskTag')
```

### Highcharts License
The burndown and other reports are generated with the help of [Highcharts.js](http://www.highcharts.com/).  To generate these reports, [evaluate and purchase the license](https://shop.highsoft.com/highcharts.html) you need.  Then configure the website's Web.config "LicensedWithHighcharts" key to reflect your license status.

