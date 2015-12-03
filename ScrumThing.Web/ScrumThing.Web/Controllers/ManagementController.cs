using ScrumThing.Web.Database;
using ScrumThing.Web.Database.Inputs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Security.Principal;

namespace ScrumThing.Web.Controllers {
    public class ManagementController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        public JsonResult AddStoryTag(Input_AddStoryTag postData) {
            return Json(context.AddStoryTag(postData.StoryTagDescription));
        }

        public JsonResult RemoveStoryTag(Input_RemoveStoryTag postData) {
            return Json(context.RemoveStoryTag(postData.StoryTagId));
        }

        public JsonResult UpdateTeamStoryTagSetting(Input_UpdateTeamStoryTagSetting postData) {
            context.UpdateTeamStoryTagSetting(postData.TeamId, postData.StoryTagId, postData.Enabled);
            return Json(true);
        }
    }
}
