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
            return Json(context.AddSprint(sprint.TeamId, sprint.Name));
        }

        public ActionResult UpdateSprint(Input_UpdateSprint sprint) {
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
        public ActionResult GetStoryTags(Input_GetStoryTags formData) {
            return Json(context.GetStoryTags(formData.TeamId));
        }

        [HttpPost]
        public ActionResult GetTaskTags() {
            return Json(context.GetTaskTags());
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
            results.LinkHierarchicalInformation();
            return Json(results.Stories);
        }

        [HttpPost]
        public ActionResult AddStory(Input_AddStory formData) {
            var id = context.AddStory(formData.SprintId, formData.Ordinal, formData.IsReachGoal);
            return Json(id);
        }

        [HttpPost]
        public ActionResult UpdateStory(Input_UpdateStory formData) {
            context.UpdateStory(formData.StoryId, formData.Title, formData.StoryText, formData.Notes, formData.StoryPoints, formData.IsReachGoal);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult RemoveStory(Input_RemoveStory formData) {
            return Json(context.RemoveStory(formData.StoryId));
        }

        [HttpPost]
        public ActionResult AddTask(Input_AddTask formData) {
            var id = context.AddTask(formData.StoryId, formData.LoggedBy);
            return Json(id);
        }

        [HttpPost]
        public ActionResult UpdateTask(Input_UpdateTask formData) {
            context.UpdateTask(formData.LoggedBy, formData.TaskId, formData.TaskText, formData.State, formData.EstimatedDevHours, formData.EstimatedQsHours, formData.DevHoursBurned, formData.QsHoursBurned, formData.RemainingDevHours, formData.RemainingQsHours, formData.TaskTags);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult RemoveTask(Input_RemoveTask formData) {
            return Json(context.RemoveTask(formData.TaskId));
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
            return Json(context.MoveStory(formData.StoryId, formData.NewOrdinal, formData.IsReachGoal));
        }

        [HttpPost]
        public ActionResult MoveTask(Input_MoveTask formData) {
            return Json(context.MoveTask(formData.TaskId, formData.NewStoryId, formData.NewOrdinal));
        }

        [HttpPost]
        public ActionResult SetStoryTags(Input_SetStoryTags formData) {
            return Json(context.SetStoryTags(formData.StoryId, formData.StoryTagIds));
        }

        [HttpPost]
        public ActionResult CarryOverStory(Input_CarryOverStory formData) {
            var maxSprint = context.GetSprints(formData.TeamId).OrderByDescending(sprint => sprint.SprintId).FirstOrDefault();
            return Json(context.CarryOverStory(formData.StoryId, maxSprint.SprintId));
        }


    }
}
