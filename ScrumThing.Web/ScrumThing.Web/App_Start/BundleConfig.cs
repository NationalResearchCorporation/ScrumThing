using System.Linq;
using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;

namespace ScrumThing.Web {
    public class BundleConfig {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/json2.js",
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js",
                        "~/Scripts/jquery-ui.multidatespicker.js",
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/jquery.stickytableheaders.js",
                        "~/Scripts/idle-timer.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
                        "~/Scripts/knockout-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/underscore").Include(
                        "~/Scripts/underscore.js"));

            bundles.Add(new ScriptBundle("~/bundles/highcharts").Include(
                        "~/Scripts/highcharts.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/bootstrap-multiselect.js"));

            bundles.Add(new ScriptBundle("~/bundles/toastr").Include(
                      "~/Scripts/toastr.js"));

            bundles.Add(new ScriptBundle("~/bundles/nrc").Include(
                      "~/TypeScript/Shared/Models/*.js",
                      "~/TypeScript/Shared/Utility.js",
                      "~/TypeScript/Knockout/TooltipBinding.js"));

            bundles.Add(new ScriptBundle("~/bundles/burndownScripts").Include(
                      "~/TypeScript/Shared/BaseSprintViewModel.js",
                      "~/TypeScript/Home/Burndown.js"));

            bundles.Add(new ScriptBundle("~/bundles/estimateVsActualsScripts").Include(
                      "~/TypeScript/Shared/BaseSprintViewModel.js",
                      "~/TypeScript/Home/EstimatesVsActualsChart.js"));

            bundles.Add(new ScriptBundle("~/bundles/homeScripts").Include(
                      "~/TypeScript/Shared/BaseSprintViewModel.js",
                      "~/TypeScript/Home/Home.js"));

            bundles.Add(new ScriptBundle("~/bundles/planSprintScripts").Include(
                      "~/TypeScript/Shared/BaseSprintViewModel.js",
                      "~/TypeScript/Home/PlanSprint.js"));

            bundles.Add(new ScriptBundle("~/bundles/viewSprintScripts").Include(
                      "~/TypeScript/Shared/BaseSprintViewModel.js",
                      "~/TypeScript/Home/ViewSprint.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/toastr.css",
                      "~/Content/bootstrap.css",
                      "~/Content/pepper-ginder-custom.css",
                      "~/Content/bootstrap-multiselect.css",
                      "~/Content/Site.css"));

            #if !DEBUG
            BundleTable.EnableOptimizations = true;
            #endif
        }
    }
}
