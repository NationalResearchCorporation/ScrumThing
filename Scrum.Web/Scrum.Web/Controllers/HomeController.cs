using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Scrum.Web.Database;

namespace Scrum.Web.Controllers {
    public class HomeController : Controller {
        private ScrumRepository context = ScrumRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult GetTeams() {
            return Json(context.GetTeams());
        }
    }
}
