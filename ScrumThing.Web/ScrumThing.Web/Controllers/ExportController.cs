using ClosedXML.Excel;
using ScrumThing.Web.Database;
using ScrumThing.Web.Database.Inputs;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace ScrumThing.Web.Controllers {
    public class ExportController : Controller {
        private ScrumThingRepository context = ScrumThingRepository.GetContext();

        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public void ExportSprintToXlsx(int sprintId) {
            // Get the raw information from the database
            var results = context.GetSprintInfo(sprintId);
            results.LinkHierarchicalInformation();

            var workbook = new XLWorkbook();
            var worksheet = workbook.AddWorksheet("Sprint Info");

            // "Constants"
            const int storyOrdinalColumn = 1;
            const int storyTextColumn = 2;
            const int storyPointsColumn = 3;
            const int storyTagsColumn = 4;
            const int taskOrdinalColumn = 5;
            const int taskTextColumn = 6;
            const int devHoursEstimatedColumn = 7;
            const int qsHoursEstimatedColumn = 8;
            const int devHoursBurnedColumn = 9;
            const int qsHoursBurnedColumn = 10;
            const int devHoursRemainingColumn = 11;
            const int qsHoursRemainingColumn = 12;
            const int taskTagsColumn = 13;
            const int lastColumn = 13;

            // Add the header
            int row = 1;
            worksheet.Cell(row, storyOrdinalColumn).Value = "Story Number";
            worksheet.Cell(row, storyTextColumn).Value = "Story Text";
            worksheet.Cell(row, storyPointsColumn).Value = "Story Points";
            worksheet.Cell(row, storyTagsColumn).Value = "Story Tags";
            worksheet.Cell(row, taskOrdinalColumn).Value = "Task Number";
            worksheet.Cell(row, taskTextColumn).Value = "Task Text";
            worksheet.Cell(row, devHoursEstimatedColumn).Value = "Estimated Dev Hours";
            worksheet.Cell(row, qsHoursEstimatedColumn).Value = "Estimated QS Hours";
            worksheet.Cell(row, devHoursBurnedColumn).Value = "Burned Dev Hours";
            worksheet.Cell(row, qsHoursBurnedColumn).Value = "Burned QS Hours";
            worksheet.Cell(row, devHoursRemainingColumn).Value = "Remaining Dev Hours";
            worksheet.Cell(row, qsHoursRemainingColumn).Value = "Remaining QS Hours";
            worksheet.Cell(row, taskTagsColumn).Value = "Task Tags";
            row++;

            // Add the stories and tasks
            foreach (var story in results.Stories.OrderBy(story => story.Ordinal)) {
                worksheet.Cell(row, storyOrdinalColumn).Value = story.Ordinal;
                worksheet.Cell(row, storyTextColumn).Value = story.StoryText;
                worksheet.Cell(row, storyPointsColumn).Value = story.StoryPoints;
                worksheet.Cell(row, storyTagsColumn).Value = string.Join(", ", story.StoryTags.Select(tag => tag.StoryTagDescription));

                foreach (var task in story.Tasks) {
                    worksheet.Cell(row, taskOrdinalColumn).Value = task.Ordinal;
                    worksheet.Cell(row, taskTextColumn).Value = task.TaskText;
                    worksheet.Cell(row, devHoursEstimatedColumn).Value = task.EstimatedDevHours;
                    worksheet.Cell(row, qsHoursEstimatedColumn).Value = task.EstimatedQsHours;
                    worksheet.Cell(row, devHoursBurnedColumn).Value = task.DevHoursBurned;
                    worksheet.Cell(row, qsHoursBurnedColumn).Value = task.QsHoursBurned;
                    worksheet.Cell(row, devHoursRemainingColumn).Value = task.RemainingDevHours;
                    worksheet.Cell(row, qsHoursRemainingColumn).Value = task.RemainingQsHours;
                    worksheet.Cell(row, taskTagsColumn).Value = string.Join(", ", task.TaskTags.Select(tag => tag.TaskTagDescription));
                    row++;
                }

                if (story.Tasks.Count == 0) {
                    row++;
                }
            }

            // Style the sheet
            worksheet.Column(storyTextColumn).Width = 50;
            worksheet.Column(taskTextColumn).Width = 50;
            worksheet.Column(storyTagsColumn).Width = 15;
            worksheet.Column(taskTagsColumn).Width = 15;
            worksheet.Column(devHoursBurnedColumn).Width = 10;
            worksheet.Column(qsHoursBurnedColumn).Width = 10;
            worksheet.Column(devHoursEstimatedColumn).Width = 10;
            worksheet.Column(qsHoursEstimatedColumn).Width = 10;
            worksheet.Column(devHoursRemainingColumn).Width = 10;
            worksheet.Column(qsHoursRemainingColumn).Width = 10;

            // Mark the whole sheet as "WrapText"
            worksheet.Range(1, 1, row - 1, lastColumn).Style.Alignment.WrapText = true;

            // Send the worksheet as the response
            using (var stream = new MemoryStream()) {
                workbook.SaveAs(stream);
                stream.Flush();
                stream.Position = 0;

                var sprint = results.Sprint.First();
                CreateExcelResponse(stream, string.Format("{0}_{1}.xlsx", RemoveWhiteSpace(sprint.TeamName), RemoveWhiteSpace(sprint.SprintName)));
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

        private string RemoveWhiteSpace(string input) {
            return Regex.Replace(input, "\\s+", ""); ;
        }
    }
}
