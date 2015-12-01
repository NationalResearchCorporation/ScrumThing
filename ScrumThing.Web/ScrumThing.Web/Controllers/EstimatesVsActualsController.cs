using ScrumThing.Web.Database;
using ScrumThing.Web.Database.Inputs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace ScrumThing.Web.Controllers {
    public class EstimatesVsActualsController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult GetEstimatesVsActuals(int sprintId) {
            var data = context.GetEstimatesVsActuals(sprintId);
            return Json(data);
        }
    }
}
