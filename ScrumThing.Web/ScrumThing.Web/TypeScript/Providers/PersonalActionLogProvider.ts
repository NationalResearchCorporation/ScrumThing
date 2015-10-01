module ScrumThing.Providers {
    export class PersonalActionLogProvider implements IPersonalActionLogProvider {

        private UserIdentity: string;

        constructor(userIdentity: string) {
            this.UserIdentity = userIdentity;
        }

        GetPersonalActionLog = (fromTime: Date, toTime: Date, timeScale: string): JQueryPromise<Array<ScrumThing.Models.PersonalActionLog.ITask>> => {
            return jQuery.ajax({
                type: 'POST',
                url: '/PersonalActionLog/GetPersonalActionLog',
                data: { UserIdentity: this.UserIdentity, FromTime: fromTime.toISOString(), ToTime: toTime.toISOString(), TimeScale: timeScale },
                success: (data: Array<ScrumThing.Models.PersonalActionLog.ITask>) => {
                    return data;
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to get personal action log: " + errorThrown);
                }
            });
        }
    };
}