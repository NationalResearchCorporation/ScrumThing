using Scrum.Web.Database.Inputs;
using Scrum.Web.Database.Outputs;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace Scrum.Web.Database {
    public class ScrumRepository : BaseRepository {
        public ScrumRepository(string connectionString) : base(connectionString) {
        }

        public static ScrumRepository GetContext() {
            return new ScrumRepository(ConfigurationManager.ConnectionStrings["Scrum"].ConnectionString);
        }

        [Schema("dbo")]
        public int AddSprint(int teamId, string name) {
            return (int)RunSproc(new object[] { teamId, name });
        }

        [Schema("dbo")]
        public int UpdateSprint(int sprintId, string name) {
            return (int)RunSproc(new object[] { sprintId, name });
        }

        [Schema("dbo")]
        public List<Output_GetSprints> GetSprints(int teamId) {
            return RunSproc<Output_GetSprints>(new object[] { teamId });
        }

        [Schema("dbo")]
        public List<Output_GetResources> GetResources(int sprintId) {
            return RunSproc<Output_GetResources>(new object[] { sprintId });
        }

        [Schema("dbo")]
        public List<Output_GetTags> GetTags()
        {
            return RunSproc<Output_GetTags>(new object[] {});
        }

        [Schema("dbo")]
        public void ClearResources(int sprintId) {
            RunSproc(new object[] { sprintId });
        }

        [Schema("dbo")]
        public void AddResource(int sprintId, string userName, double devPercentage, double qsPercentage, double days, double totalDevHours, double totalQsHours, double totalHours) {
            RunSproc(new object[] { sprintId, userName, devPercentage, qsPercentage, days, totalDevHours, totalQsHours, totalHours });
        }

        [Schema("dbo")]
        public Output_GetSprintInfo GetSprintInfo(int sprintId) {
            var result = RunSproc<Output_GetSprintInfo_Story,
                                  Output_GetSprintInfo_Task,
                                  Output_GetSprintInfo_Assignment,
                                  Output_GetSprintInfo_Note,
                                  Output_GetSprintInfo_Tag>(new object[] { sprintId });
            return new Output_GetSprintInfo() {
                Stories = result.Item1,
                Tasks = result.Item2,
                Assignments = result.Item3,
                Notes = result.Item4,
                Tags = result.Item5
            };
        }

        [Schema("dbo")]
        public Output_AddStory AddStory(int sprintId) {
            return RunSproc<Output_AddStory>(new object[] { sprintId }).First();
        }

        [Schema("dbo")]
        public void UpdateStory(int storyId, string storyText, int storyPoints, bool isReachGoal) {
            RunSproc(new object[] { storyId, storyText, storyPoints, isReachGoal });
        }

        [Schema("dbo")]
        public void RemoveStory(int storyId) {
            RunSproc(new object[] { storyId });
        }

        [Schema("dbo")]
        public Output_AddTask AddTask(int storyId) {
            return RunSproc<Output_AddTask>(new object[] { storyId }).First();
        }

        [Schema("dbo")]
        public void UpdateTask(int taskId, string taskText, string state, double estimatedDevHours, double estimatedQsHours,
                               double devHoursBurned, double qsHoursBurned, double remainingDevHours, double remainingQsHours, string tags) {
            RunSproc(new object[] { taskId, taskText, state, estimatedDevHours, estimatedQsHours, devHoursBurned, qsHoursBurned, remainingDevHours, remainingQsHours, tags });
        }

        [Schema("dbo")]
        public void RemoveTask(int taskId) {
            RunSproc(new object[] { taskId });
        } 

        [Schema("dbo")]
        public List<Output_GetSprintDays> GetSprintDays(int sprintId) {
            return RunSproc<Output_GetSprintDays>(new object[] { sprintId });
        }

        [Schema("dbo")]
        public void SetSprintDays(int sprintId, string days) {
            RunSproc(new object[] { sprintId, days });
        }

        [Schema("dbo")]
        public List<Output_GetBurndown> GetBurndown(int sprintId, DateTime relativeDate) {
            return RunSproc<Output_GetBurndown>(new object[] { sprintId, relativeDate });
        }

        [Schema("dbo")]
        public void SetAssignments(int taskId, string assignments) {
            RunSproc(new object[] { taskId, assignments });
        }

        [Schema("dbo")]
        public Output_AddNote AddNote(int taskId, string username, string note) {
            var results = RunSproc<Output_AddNote>(new object[] { taskId, username, note });
            return results.Single();
        }

        [Schema("dbo")]
        public List<Output_GetTeams> GetTeams() {
            return RunSproc<Output_GetTeams>(new object[] {});
        }

        [Schema("dbo")]
        public List<Output_GetEstimatesVsActuals> GetEstimatesVsActuals(int sprintId) {
            return RunSproc<Output_GetEstimatesVsActuals>(new object[] { sprintId });
        }

        [Schema("dbo")]
        public List<Output_MoveStory> MoveStory(int storyId, int newOrdinal) {
            return RunSproc<Output_MoveStory>(new object[] { storyId, newOrdinal });
        }

        [Schema("dbo")]
        public List<Output_MoveTask> MoveTask(int taskId, int newStoryId, int newOrdinal) {
            return RunSproc<Output_MoveTask>(new object[] { taskId, newStoryId, newOrdinal });
        }
    }
}
