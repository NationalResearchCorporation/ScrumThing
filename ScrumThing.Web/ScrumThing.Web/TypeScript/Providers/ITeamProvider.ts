module ScrumThing.Providers {
    export interface ITeamProvider {
        GetTeams: () => JQueryPromise<Array<RawTeam>>;
    };
}