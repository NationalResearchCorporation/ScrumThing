module ScrumThing.Providers {
    export class TeamProvider implements ITeamProvider {
        GetTeams = (): JQueryPromise<Array<RawTeam>> => {
            return jQuery.ajax({
                type: 'POST',
                url: '/Home/GetTeams',
                success: (data: Array<RawTeam>) => {
                    return data;
                },
                error: (xhr: JQueryXHR, textStatus: string, errorThrown: string) => {
                    toastr.error("Failed to get teams: " + errorThrown);
                }
            });
        }
    };
} 