using ScrumThing.Web.Database;
using ScrumThing.Web.Database.Inputs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace ScrumThing.Web.Controllers {
    public class PlanSprintController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult AddSprint(Input_AddSprint sprint) {

            sprint.Name = sprint.Name ?? "";

            return Json(context.AddSprint(sprint.TeamId, sprint.Name));
        }

        public ActionResult UpdateSprint(Input_UpdateSprint sprint)
        {

            return Json(context.UpdateSprint(sprint.SprintId, sprint.Name));
        }

        [HttpPost]
        public ActionResult GetSprints(Input_GetSprint formData) {
            return Json(context.GetSprints(formData.TeamId));
        }

        [HttpPost]
        public ActionResult GetResources(Input_GetResources formData) {
            return Json(context.GetResources(formData.SprintId));
        }

        [HttpPost]
        [OutputCache(Duration = 3600, VaryByParam = "none")]
        public ActionResult GetTags()
        {
            return Json(context.GetTags());
        }

        [HttpPost]
        public ActionResult SetResources(Input_SetResources formData) {
            var resources = JsonConvert.DeserializeObject<List<Input_SetResources_Resource>>(formData.ResourcesJson);
            context.ClearResources(formData.SprintId);
            foreach (var resource in resources) {
                context.AddResource(formData.SprintId, resource.UserName, resource.DevPercentage, resource.QsPercentage, resource.Days, resource.TotalDevHours, resource.TotalQsHours, resource.TotalHours);
            }
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult GetSprintInfo(Input_GetSprintInfo formData) {
            var results = context.GetSprintInfo(formData.SprintId);

            // Link Tasks to Stories
            foreach (var story in results.Stories) {
                story.Tasks = results.Tasks
                                     .Where(task => task.StoryId == story.StoryId)
                                     .ToList();

                // Add Assignments and Notes to Tasks
                foreach (var task in story.Tasks) {
                    task.Assignments = results.Assignments
                                              .Where(assignment => assignment.TaskId == task.TaskId)
                                              .ToList();

                    task.Notes = results.Notes
                                        .Where(note => note.TaskId == task.TaskId)
                                        .ToList();

                    task.Tags = results.Tags
                                       .Where(tag => tag.TaskId == task.TaskId)
                                       .ToList();
                }
            }

            return Json(results.Stories);
        }

        [HttpPost]
        public ActionResult AddStory(Input_AddStory formData) {
            var id = context.AddStory(formData.SprintId);
            return Json(id);
        }

        [HttpPost]
        public ActionResult UpdateStory(Input_UpdateStory formData) {
            context.UpdateStory(formData.StoryId, formData.StoryText, formData.StoryPoints, formData.IsReachGoal);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult RemoveStory(Input_RemoveStory formData) {
            context.RemoveStory(formData.StoryId);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult AddTask(Input_AddTask formData) {
            var id = context.AddTask(formData.StoryId);
            return Json(id);
        }

        [HttpPost]
        public ActionResult UpdateTask(Input_UpdateTask formData) {
            context.UpdateTask(formData.TaskId, formData.TaskText, formData.State, formData.EstimatedDevHours, formData.EstimatedQsHours, formData.DevHoursBurned, formData.QsHoursBurned, formData.RemainingDevHours, formData.RemainingQsHours, formData.Tags);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult RemoveTask(Input_RemoveTask formData) {
            context.RemoveTask(formData.TaskId);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult GetSprintDays(Input_GetSprintDays formData) {
            return Json(context.GetSprintDays(formData.SprintId));
        }

        [HttpPost]
        public ActionResult SetSprintDays(Input_SetSprintDays formData) {
            context.SetSprintDays(formData.SprintId, formData.Days);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult MoveStory(Input_MoveStory formData) {
            return Json(context.MoveStory(formData.StoryId, formData.NewOrdinal));
        }

        [HttpPost]
        public ActionResult MoveTask(Input_MoveTask formData) {
            return Json(context.MoveTask(formData.TaskId, formData.NewStoryId, formData.NewOrdinal));
        }
    }
}
