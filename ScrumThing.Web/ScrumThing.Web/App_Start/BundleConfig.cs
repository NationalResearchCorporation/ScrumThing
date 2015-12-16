using System.Linq;
using System.Collections.Generic;
using System.Web;
using System.Web.Optimization;
using LicensedBundler;

namespace ScrumThing.Web {
    public class BundleConfig {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new LicensedScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/json2.js",
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js",
                        "~/Scripts/jquery-ui.multidatespicker.js",
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/jquery.stickytableheaders.js",
                        "~/Scripts/idle-timer.min.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/knockout").Include(
                        "~/Scripts/knockout-{version}.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/underscore").Include(
                        "~/Scripts/underscore.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/highcharts").Include(
                        "~/Scripts/highcharts.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new LicensedScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new LicensedScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js",
                      "~/Scripts/moment.js",
                      "~/Scripts/moment-with-locales.js",
                      "~/Scripts/bootstrap-datetimepicker.js",
                      "~/Scripts/bootstrap-multiselect.js",
                      "~/Scripts/markdown.js",
                      "~/Scripts/to-markdown.js",
                      "~/Scripts/bootstrap-markdown.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/toastr").Include(
                      "~/Scripts/toastr.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/nrc").Include(
                      "~/TypeScript/Shared/Models/*.js",
                      "~/TypeScript/Shared/Utility.js",
                      "~/TypeScript/Shared/SizeToContent.js",
                      "~/TypeScript/Knockout/DateTimePickerBinding.js",
                      "~/TypeScript/Knockout/TooltipBinding.js",
                      "~/TypeScript/Knockout/MarkdownBinding.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/scrumthing").Include(
                      "~/TypeScript/Shared/Globals.js",
                      "~/TypeScript/Providers/TeamProvider.js",
                      "~/TypeScript/Shared/BaseViewModel.js",
                      "~/TypeScript/Shared/BaseSprintViewModel.js"
                ));

            bundles.Add(new LicensedScriptBundle("~/bundles/burndownScripts").Include(
                      "~/TypeScript/Home/Burndown.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/estimateVsActualsScripts").Include(
                      "~/TypeScript/Home/EstimatesVsActualsChart.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/homeScripts").Include(
                      "~/TypeScript/Home/Home.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/planSprintScripts").Include(
                      "~/TypeScript/Home/PlanSprint.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/viewSprintScripts").Include(
                      "~/TypeScript/Home/ViewSprint.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/personalActionLog").Include(
                      "~/TypeScript/Providers/PersonalActionLogProvider.js",
                      "~/TypeScript/Providers/TimeProvider.js",
                      "~/TypeScript/Shared/Models/PersonalActionLog/Task.js",
                      "~/TypeScript/Shared/Models/PersonalActionLog/TimePeriod.js",
                      "~/TypeScript/Shared/Models/PersonalActionLog/Log.js",
                      "~/TypeScript/Home/PersonalActionLog.js",
                      "~/TypeScript/Home/PersonalActionLogBinder.js"));

            bundles.Add(new LicensedScriptBundle("~/bundles/management").Include(
                      "~/TypeScript/Home/Management.js",
                      "~/TypeScript/Home/ManagementBinder.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/toastr.css",
                      "~/Content/bootstrap.css",
                      "~/Content/pepper-ginder-custom.css",
                      "~/Content/bootstrap-multiselect.css",
                      "~/Content/font-awesome.css",
                      "~/Content/bootstrap-datetimepicker.css",
                      "~/Content/bootstrap-markdown/bootstrap-markdown.css",
                      "~/Content/Site.css"));

            #if !DEBUG
            BundleTable.EnableOptimizations = true;
            #endif
        }
    }
}
