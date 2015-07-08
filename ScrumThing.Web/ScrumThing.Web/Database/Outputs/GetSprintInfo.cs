using System.Collections.Generic;
using System.Linq;

namespace ScrumThing.Web.Database.Outputs {
    public class Output_GetSprintInfo {
        public List<Output_GetSprintInfo_Sprint> Sprint { get; set; }
        public List<Output_GetSprintInfo_Story> Stories { get; set; }
        public List<Output_GetSprintInfo_Task> Tasks { get; set; }
        public List<Output_GetSprintInfo_Assignment> Assignments { get; set; }
        public List<Output_GetSprintInfo_Note> Notes { get; set; }
        public List<Output_GetSprintInfo_StoryTag> StoryTags { get; set; }
        public List<Output_GetSprintInfo_TaskTag> TaskTags { get; set; }

        public void LinkHierarchicalInformation() {
            Stories = Stories.OrderBy(story => story.IsReachGoal)
                             .ThenBy(story => story.Ordinal)
                             .ToList();

            // Link Tasks to Stories
            foreach (var story in Stories) {
                story.Tasks = Tasks.Where(task => task.StoryId == story.StoryId)
                                   .OrderBy(task => task.Ordinal)
                                   .ToList();

                story.StoryTags = StoryTags.Where(tag => tag.StoryId == story.StoryId)
                                           .ToList();

                // Add Assignments and Notes to Tasks
                foreach (var task in story.Tasks) {
                    task.Assignments = Assignments.Where(assignment => assignment.TaskId == task.TaskId)
                                                  .ToList();

                    task.Notes = Notes.Where(note => note.TaskId == task.TaskId)
                                      .ToList();

                    task.TaskTags = TaskTags.Where(tag => tag.TaskId == task.TaskId)
                                            .ToList();
                }
            }
        }
    }

    public class Output_GetSprintInfo_Sprint {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public int SprintId { get; set; }
        public string SprintName { get; set; }
    }

    public class Output_GetSprintInfo_Story {
        public int StoryId { get; set; }
        public string StoryText { get; set; }
        public double StoryPoints { get; set; }
        public int Ordinal { get; set; }

        public bool IsReachGoal { get; set; }

        // Will be filled in by the controller, not the database
        public List<Output_GetSprintInfo_Task> Tasks { get; set; }
        public List<Output_GetSprintInfo_StoryTag> StoryTags { get; set; }
    }

    public class Output_GetSprintInfo_Task {
        public int StoryId { get; set; }
        public int TaskId { get; set; }
        public string TaskText { get; set; }
        public string State { get; set; }
        public double EstimatedDevHours { get; set; }
        public double EstimatedQsHours { get; set; }
        public double DevHoursBurned { get; set; }
        public double QsHoursBurned { get; set; }
        public double RemainingDevHours { get; set; }
        public double RemainingQsHours { get; set; }
        public int Ordinal { get; set; }

        // Will be filled in by the controller, not the database
        public List<Output_GetSprintInfo_Assignment> Assignments { get; set; }
        public List<Output_GetSprintInfo_Note> Notes { get; set; }
        public List<Output_GetSprintInfo_TaskTag> TaskTags { get; set; }
    }

    public class Output_GetSprintInfo_Assignment {
        public string UserName { get; set; }
        public int TaskId { get; set; }
    }

    public class Output_GetSprintInfo_Note {
        public int TaskId { get; set; }
        public string UserName { get; set; }
        public string Note { get; set; }
        public string Timestamp { get; set; }
    }

    public class Output_GetSprintInfo_StoryTag {
        public int StoryId { get; set; }
        public int StoryTagId { get; set; }
        public string StoryTagDescription { get; set; }
    }

    public class Output_GetSprintInfo_TaskTag {
        public int TaskId { get; set; }
        public int TaskTagId { get; set; }
        public string TaskTagDescription { get; set; }
        public string TaskTagClasses { get; set; }
        public bool IsIncluded { get; set; }
    }
}
