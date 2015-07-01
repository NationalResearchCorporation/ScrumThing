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
    public class ViewSprintController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult SetAssignments(Input_Assignment formData) {
            context.SetAssignments(formData.TaskId, formData.Assignments);
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        [HttpPost]
        public ActionResult AddNote(Input_AddNote formData) {
            var note = context.AddNote(formData.TaskId, User.Identity.Name, formData.Note);
            return Json(note);
        }
    }
}
