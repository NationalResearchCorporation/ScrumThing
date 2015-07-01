using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Scrum.Web.Database.Outputs;

namespace Scrum.Web.Database.Outputs.Tests {
    [TestClass]
    public class GetBurnDownTests {
        [TestMethod]
        public void FormattedBurnDate_Normally_IsFormattedProperly() {
            var b = new Output_GetBurndown();
            b.SprintDay = new DateTime(2015, 12, 29);

            var expectedResult = "12-29 Tue";
            var actualResult = b.FormattedBurnDate;

            Assert.AreEqual(expectedResult, actualResult);

        }
    }
}
