using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ScrumThing.Web.Database;

namespace ScrumThing.Web.Controllers {
    public class HomeController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult GetTeams() {
            return Json(context.GetTeams());
        }
    }
}
