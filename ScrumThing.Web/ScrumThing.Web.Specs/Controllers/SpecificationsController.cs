using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScrumThing.Web.Specs.Controllers {
    public class SpecificationsController : Controller {
        public ActionResult Run() {
            return View("SpecRunner");
        }
    }
}