using System.Web;
using System.Web.Mvc;

namespace Scrum.Web {
    public class FilterConfig {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters) {
            filters.Add(new NRC.Reveal.Common.Mvc.HandleErrorAttribute());
        }
    }
}
