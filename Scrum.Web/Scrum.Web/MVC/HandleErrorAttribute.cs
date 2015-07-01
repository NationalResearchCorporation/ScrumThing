using System;
using System.Net;
using System.Web.Mvc;

namespace NRC.Reveal.Common.Mvc {
    /// <summary>
    /// This filter is applied globally to log all controller exceptions, and redirect to the Error view.
    /// </summary>
    public class HandleErrorAttribute : System.Web.Mvc.HandleErrorAttribute {

        private static NLog.Logger logger = NLog.LogManager.GetCurrentClassLogger();
        private const string AREA = "area";
        private const string CONTROLLER = "controller";
        private const string ACTION = "action";
        private const string ERROR_VIEW = "Error";
        private const string FALLBACK_ERROR_VIEW = "~/Error.html";

        /// <summary>
        /// Called when an exception occurs.
        /// </summary>
        /// <param name="filterContext">The action-filter context.</param>
        public override void OnException(System.Web.Mvc.ExceptionContext filterContext) {
            try {
                object area, controller, action;
                filterContext.RouteData.DataTokens.TryGetValue(AREA, out area);
                filterContext.RouteData.Values.TryGetValue(CONTROLLER, out controller);
                filterContext.RouteData.Values.TryGetValue(ACTION, out action);
                
                string msg = String.Format("An error occurred in Area={0}; Controller={1}; Action={2}.",
                    area ?? String.Empty,
                    controller ?? String.Empty,
                    action ?? String.Empty);

                logger.ErrorException(msg, filterContext.Exception);

                if(controller != null && !controller.Equals("Error")) {
                    filterContext.Result = new ViewResult { ViewName = ERROR_VIEW };
                } else {
                    filterContext.Result = new FilePathResult(FALLBACK_ERROR_VIEW, "text/html");
                }
                filterContext.ExceptionHandled = true;
                filterContext.HttpContext.Response.Clear();
                filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                filterContext.HttpContext.Response.TrySkipIisCustomErrors = true;
            } catch (Exception ex) {
                logger.ErrorException("An error occurred in the OnException method of HandleErrorAttribute", ex);
                throw; //let mvc redirect based on defaultRedirect attribute of CustomErrors setting in web.config
            }
        }
    }
}