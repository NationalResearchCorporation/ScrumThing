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
    public class PersonalActionLogController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult GetPersonalActionLog(Input_GetPersonalActionLog formData) {
            return Json(context.GetPersonalActionLog(formData.UserIdentity, formData.FromTime, formData.ToTime, formData.TimeScale));
        }
    }
}
