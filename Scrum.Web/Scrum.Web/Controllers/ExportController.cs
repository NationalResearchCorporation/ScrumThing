using ClosedXML.Excel;
using Scrum.Web.Database;
using Scrum.Web.Database.Inputs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Scrum.Web.Controllers {
    public class ExportController : Controller {
        private ScrumRepository context = ScrumRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public void ExportSprintToXlsx(int sprintId) {
            // Get the raw information from the database
            var results = context.GetSprintInfo(sprintId);

            // TODO: Deduplicate this with PlanSprint.GetSprintInfo
            // Link Tasks to Stories
            foreach (var story in results.Stories) {
                story.Tasks = results.Tasks
                                     .Where(task => task.StoryId == story.StoryId)
                                     .OrderBy(task => task.Ordinal)
                                     .ToList();
            }

            var workbook = new XLWorkbook();
            var worksheet = workbook.AddWorksheet("Sprint Info");

            // "Constants"
            const int storyOrdinalColumn = 1;
            const int storyTextColumn = 2;
            const int storyPointsColumn = 3;
            const int taskOrdinalColumn = 4;
            const int taskTextColumn = 5;
            const int devHoursEstimatedColumn = 6;
            const int qsHoursEstimatedColumn = 7;
            const int lastColumn = 7;

            // Add the header
            int row = 1;
            worksheet.Cell(row, storyOrdinalColumn).Value = "Story Number";
            worksheet.Cell(row, storyTextColumn).Value = "Story Text";
            worksheet.Cell(row, storyPointsColumn).Value = "Story Points";
            worksheet.Cell(row, taskOrdinalColumn).Value = "Task Number";
            worksheet.Cell(row, taskTextColumn).Value = "Task Text";
            worksheet.Cell(row, devHoursEstimatedColumn).Value = "Dev Hours";
            worksheet.Cell(row, qsHoursEstimatedColumn).Value = "QS Hours";
            row++;

            // Add the stories and tasks
            foreach (var story in results.Stories.OrderBy(story => story.Ordinal)) {
                worksheet.Cell(row, storyOrdinalColumn).Value = story.Ordinal;
                worksheet.Cell(row, storyTextColumn).Value = story.StoryText;
                worksheet.Cell(row, storyPointsColumn).Value = story.Ordinal;

                foreach (var task in story.Tasks) {
                    worksheet.Cell(row, taskOrdinalColumn).Value = task.Ordinal;
                    worksheet.Cell(row, taskTextColumn).Value = task.TaskText;
                    worksheet.Cell(row, devHoursEstimatedColumn).Value = task.EstimatedDevHours;
                    worksheet.Cell(row, qsHoursEstimatedColumn).Value = task.EstimatedQsHours;
                    row++;
                }

                if (story.Tasks.Count == 0) {
                    row++;
                }
            }

            // Style the sheet
            worksheet.Column(storyTextColumn).Width = 50;
            worksheet.Column(taskTextColumn).Width = 50;
            // Mark the whole sheet as "WrapText"
            worksheet.Range(1, 1, row - 1, lastColumn).Style.Alignment.WrapText = true;

            // Send the worksheet as the response
            using (var stream = new MemoryStream()) {
                workbook.SaveAs(stream);
                stream.Flush();
                stream.Position = 0;

                // TODO: Change this to the actual sprint name
                CreateExcelResponse(stream, string.Format("Sprint {0} Export.xlsx", sprintId));
            }
        }

        private HttpResponse CreateExcelResponse(MemoryStream stream, string filename) {
            var response = System.Web.HttpContext.Current.Response;

            response.ClearContent();
            response.Clear();
            response.Buffer = true;
            response.Charset = string.Empty;

            response.Cache.SetCacheability(HttpCacheability.NoCache);
            response.AddHeader("content-disposition", "attachment; filename=\"" + filename + "\"");
            response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            byte[] data = new byte[stream.Length];
            stream.Read(data, 0, data.Length);
            stream.Close();

            response.BinaryWrite(data);
            response.Flush();
            response.End();

            return response;
        }
    }
}
