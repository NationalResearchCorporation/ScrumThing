/// <reference path="../../../../scrumthing.web/scripts/typings/knockout/knockout.d.ts" />

describe("The Personal Action Log", () => {

    var fakePalProvider: ScrumThing.Providers.IPersonalActionLogProvider;
    var fakePalProviderSpy: jasmine.Spy;
    var fakeTeamProvider: ScrumThing.Providers.ITeamProvider;
    var fakeTeamProviderSpy: jasmine.Spy;
    var fakeTimeProvider: ScrumThing.Providers.ITimeProvider;

    beforeEach(() => {
        fakeTimeProvider = { GetCurrentTime: () => new Date() };

        //fakePalProvider and fakeTeamProvider are used when we just need a dumb substitute to satisfy a constructor
        //   where we don't care about the internal behavior of the substitute.
        fakePalProvider = { GetPersonalActionLog: (): any  => { return {}; } };

        //fakePalProviderSpy is used when we need to verify that the internal behavior of the provider is as expected.
        var fakeJQueryLogPromise: JQueryPromise<ScrumThing.Models.PersonalActionLog.ILog> =
            jasmine.createSpyObj<JQueryPromise<ScrumThing.Models.PersonalActionLog.ILog>>('JQueryPromise', ['state', 'always', 'done', 'fail', 'progress', 'pipe']);
        fakePalProviderSpy = spyOn(fakePalProvider, 'GetPersonalActionLog').and.callFake(() => { return fakeJQueryLogPromise });

        var fakeJQueryTeamPromise: JQueryPromise<Array<ScrumThing.RawTask>> =
            jasmine.createSpyObj<JQueryPromise<Array<ScrumThing.RawTask>>>('JQueryPromise', ['state', 'always', 'done', 'fail', 'progress', 'pipe']);
        fakeTeamProvider = { GetTeams: (): any => { return fakeJQueryTeamPromise; } }
    });

    describe("when doing long operations", () => {
        
        it("sets a processing flag whenever the viewmodel is waiting for the log to be refreshed.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            pal.RefreshData();
            expect(pal.CurrentlyRefreshingData()).toEqual(true);
        })

    });

    describe("date selection component", () => {

        it("by default, has the from-timeperiod set as today at 9:30am if it is currently after 9:30am.", () => {
            var someTimeInTheAfternoon = new Date(2000, 1, 1, 13, 0);
            var timeProvider: ScrumThing.Providers.ITimeProvider = { GetCurrentTime: () => someTimeInTheAfternoon };
            var nineThirtyInTheMorning = new Date(2000, 1, 1, 9, 30);

            var pal = new ScrumThing.ViewModels.PersonalActionLog(timeProvider, fakePalProvider, fakeTeamProvider);

            expect(pal.FromDateTime()).toEqual(nineThirtyInTheMorning);
        });

        it("by default, has the from-timeperiod set as yesterday at 9:30am if it is currently at or before 9:30am.", () => {
            var someTimeBeforeNineThirty = new Date(2000, 2, 2, 9, 20);
            var timeProvider: ScrumThing.Providers.ITimeProvider = { GetCurrentTime: () => someTimeBeforeNineThirty }
            var yesterdayAtNineThirtyInTheMorning = new Date(2000, 2, 1, 9, 30);

            var pal = new ScrumThing.ViewModels.PersonalActionLog(timeProvider, fakePalProvider, fakeTeamProvider);

            expect(pal.FromDateTime()).toEqual(yesterdayAtNineThirtyInTheMorning);
        });

        it("by default, has the to-timeperiod set as the current date and time.", () => {
            var currentTime = new Date(2000, 1, 1, 1, 0);
            var timeProvider: ScrumThing.Providers.ITimeProvider = { GetCurrentTime: () => currentTime };

            var pal = new ScrumThing.ViewModels.PersonalActionLog(timeProvider, fakePalProvider, fakeTeamProvider);

            expect(pal.ToDateTime()).toEqual(currentTime);
        });

        it("sets the invalid-date-property to true when the to-timeperiod is set earlier than the from-timeperiod.", () => {
            var timeProvider: ScrumThing.Providers.ITimeProvider = { GetCurrentTime: () => new Date() };
            var pal = new ScrumThing.ViewModels.PersonalActionLog(timeProvider, fakePalProvider, fakeTeamProvider);

            pal.FromDateTime(new Date(2000, 2, 1, 12, 0));
            pal.ToDateTime(new Date(2000, 2, 1, 11, 0));

            expect(pal.DateSelectionIsInvalid()).toEqual(true);
        });

        it("sets the invalid-date-property to false when the timeperiods are set to a valid state.", () => {
            var timeProvider: ScrumThing.Providers.ITimeProvider = { GetCurrentTime: () => new Date() };
            var pal = new ScrumThing.ViewModels.PersonalActionLog(timeProvider, fakePalProvider, fakeTeamProvider);

            pal.FromDateTime(new Date(2000, 2, 1, 12, 0));
            pal.ToDateTime(new Date(2000, 2, 1, 13, 0));

            expect(pal.DateSelectionIsInvalid()).toEqual(false);
        });

    });

    describe("timescale component", () => {

        it("includes the full list of valid timescales ordered ascending by scale scope.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            expect(pal.TimeScales).toEqual(['sprint', 'week', 'day', 'hour', 'minute', 'none']);
        });

        it("has the timescale set to 'day' by default.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            expect(pal.CurrentTimeScale()).toEqual('day');
        });

    });

    describe("timeperiods list", () => {

        it("is initially set with new data when the personal action log loads.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            expect(fakePalProviderSpy.calls.count()).toEqual(1);
        });

        it("is reset with new data when the timescale is changed.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            pal.CurrentTimeScale('hour');

            var callOnInitialLoad: number = 1;
            var callAfterTimeScaleChange: number = 1;
            var expectedCallCount = callOnInitialLoad + callAfterTimeScaleChange;
            expect(fakePalProviderSpy.calls.count()).toEqual(expectedCallCount);
        });

        it("is reset with new data when the from-time is changed.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            pal.FromDateTime(new Date());

            var callOnInitialLoad: number = 1;
            var callAfterFromTimeChange: number = 1;
            var expectedCallCount = callOnInitialLoad + callAfterFromTimeChange;
            expect(fakePalProviderSpy.calls.count()).toEqual(expectedCallCount);
        });

        it("is reset with new data when the to-time is changed.", () => {
            var pal = new ScrumThing.ViewModels.PersonalActionLog(fakeTimeProvider, fakePalProvider, fakeTeamProvider);
            pal.ToDateTime(new Date());

            var callOnInitialLoad: number = 1;
            var callAfterToTimeChange: number = 1;
            var expectedCallCount = callOnInitialLoad + callAfterToTimeChange;
            expect(fakePalProviderSpy.calls.count()).toEqual(expectedCallCount);
        });

        it("declares that it has no timeperiods if no timeperiods exist.", () => {
            var emptyTaskArray: Array<ScrumThing.Models.PersonalActionLog.ITask> = [];
            var log = new ScrumThing.Models.PersonalActionLog.Log(emptyTaskArray);
            expect(log.HasTimePeriods()).toEqual(false);
        });

        it("declares that it has timeperiods if timeperiods do exist.", () => {
            var tasks: Array<ScrumThing.Models.PersonalActionLog.ITask> = [
                <ScrumThing.Models.PersonalActionLog.ITask>{
                    MinTimeperiodValue: new Date(),
                    MaxTimeperiodValue: new Date()
                }
            ];
            var log = new ScrumThing.Models.PersonalActionLog.Log(tasks);
            expect(log.HasTimePeriods()).toEqual(true);
        });

        it("contains all timeperiods that have log data available.", () => {
            var tasks: Array<ScrumThing.Models.PersonalActionLog.ITask> = [
                <ScrumThing.Models.PersonalActionLog.ITask>{
                    MinTimeperiodValue: new Date(2000, 1),
                    MaxTimeperiodValue: new Date(2000, 2)
                },
                <ScrumThing.Models.PersonalActionLog.ITask>{
                    MinTimeperiodValue: new Date(2000, 3),
                    MaxTimeperiodValue: new Date(2000, 4)
                }
            ];
            var log = new ScrumThing.Models.PersonalActionLog.Log(tasks);
            expect(log.TimePeriods.length).toEqual(2);
        });

        it("is in descending order by tasks' minimum timeperiod value.", () => {
            var tasksInAscendingOrder: Array<ScrumThing.Models.PersonalActionLog.ITask> = [
                <ScrumThing.Models.PersonalActionLog.ITask>{
                    MinTimeperiodValue: new Date(2000, 1),
                    MaxTimeperiodValue: new Date(2000, 2)
                },
                <ScrumThing.Models.PersonalActionLog.ITask>{
                    MinTimeperiodValue: new Date(2000, 3),
                    MaxTimeperiodValue: new Date(2000, 4)
                },
                < ScrumThing.Models.PersonalActionLog.ITask > {
                    MinTimeperiodValue: new Date(2000, 5),
                    MaxTimeperiodValue: new Date(2000, 6)
                }
            ];
            var log = new ScrumThing.Models.PersonalActionLog.Log(tasksInAscendingOrder);
            expect(_.first(log.TimePeriods).MinTimeperiodValue).toEqual(new Date(2000, 5));
        });

    });

});