using Scrum.Web.Database;
using Scrum.Web.Database.Inputs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Scrum.Web.Controllers {
    public class BurndownController : Controller {
        private ScrumRepository context = ScrumRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult GetBurndown(int sprintId) {
            return Json(context.GetBurndown(sprintId, DateTime.Now));
        }

    }
}
