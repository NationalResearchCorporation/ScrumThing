describe("The Personal Action Log", function () {
    describe("general error checking", function () {
        it("sets the user-not-found message if the currently logged in user doesn't exist in the database.");
        it("sets the user-not-found message to blank if the currently logged in user exists in the database.");
    });
    describe("date selection component", function () {
        it("by default, has the from-timeperiod set as today at 9:30am if it is currently after 9:30am.");
        it("by default, has the from-timeperiod set as yesterday at 9:30am if it is currently at or before 9:30am.");
        it("by default, has the to-timeperiod set as the current date and time.");
        it("sets the invalid input message when the to-timeperiod is set earlier than the from-timeperiod.");
        it("sets the invalid input message to an empty value when the timeperiods are set to a valid state.");
        it("sets the to-timeperiod equal to the from-timeperiod when the user tries to select a to-timeperiod earlier than the from-timeperiod.");
    });
    describe("timescale component", function () {
        it("includes the full list of valid timescales ordered ascending by scale scope.");
        it("has the timescale set to 'day' by default.");
    });
    describe("timeperiods list", function () {
        it("is reset with new data when the timescale is changed.");
        it("is reset with new data when the from-time is changed.");
        it("is reset with new data when the to-time is changed.");
        it("is null if no timeperiods exist.");
        it("contains all timeperiods that have log data available.");
        it("is in descending order by tasks' rounded timeperiods.");
        describe("each timeperiod", function () {
            it("contains all of the tasks affected during the timeperiod.");
            it("has tasks ordered ascending by sprint name (desc), sprint id (desc), story ordinal (asc), then task ordinal (asc).");
            describe("each task", function () {
                describe("general task information", function () {
                    it("includes whom the most recent activity was logged by.");
                    it("includes the most recent time that the task was edited.");
                    // This isn't currently supplied by the sproc, so will need to ammend to include this value.
                    it("includes a the rounded timeperiod value that the task falls into.");
                    it("includes the id of its sprint.");
                    it("includes the name of its sprint.");
                    it("includes its story ordinal.");
                    it("includes its story text.");
                    it("includes whether or not the task is a reach goal.");
                    it("includes the estimated story points for its story.");
                    it("includes its task ordinal.");
                    it("includes text for the task.");
                    it("includes the current state of the task.");
                    it("includes the estimated dev hours for the task.");
                    it("includes the estimated qs hours for the task.");
                });
                describe("burned hour information", function () {
                    it("includes the total dev hours burned for the task.");
                    it("includes the total qs hours burned for the task.");
                    it("includes the change in dev hours burned for the task.");
                    it("includes the change in qs hours burned for the task.");
                });
                describe("remaining hour information", function () {
                    it("includes the total dev hours remaining for the task.");
                    it("includes the total qs hours remaining for the task.");
                    it("includes the change in dev hours remaining for the task.");
                    it("includes the change in qs hours remaining for the task.");
                });
            });
        });
    });
});
//# sourceMappingURL=PersonalActionLogSpecifications.js.map