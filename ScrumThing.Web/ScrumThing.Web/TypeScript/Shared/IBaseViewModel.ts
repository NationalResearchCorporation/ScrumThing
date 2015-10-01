module ScrumThing {
    export interface IBaseViewModel {
        RefreshData: () => void;
        GetTeams: () => void;
        currentTeamDropdown: KnockoutComputed<string>;
        teams: KnockoutObservableArray<RawTeam>;
        currentTeam: KnockoutObservable<RawTeam>;
        getUrlVars: () => any[];
    }
} 