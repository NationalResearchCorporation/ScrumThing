/// <reference path="../providers/iteamprovider.ts" />
/// <reference path="../providers/teamprovider.ts" />

module ScrumThing {
    export class BaseViewModel implements IBaseViewModel {

        public currentTeamDropdown: KnockoutComputed<string>;
        public currentTeam: KnockoutObservable<RawTeam> = ko.observable<RawTeam>();
        public teams: KnockoutObservableArray<RawTeam> = ko.observableArray<RawTeam>();
        public RefreshData: () => void = () => { throw new Error("This method must be overriden.") };
        private TeamProvider: ScrumThing.Providers.ITeamProvider;

        public showSprintDropdown: KnockoutObservable<boolean>;

        constructor(teamProvider: ScrumThing.Providers.ITeamProvider) {
            this.showSprintDropdown = ko.observable(true);

            this.TeamProvider = teamProvider;

            this.GetTeams();

            this.currentTeamDropdown = ko.computed(() => {
                return this.currentTeam() ? this.currentTeam().TeamName : '';
            });

            this.currentTeam.subscribe(() => {
                jQuery.cookie('team', this.currentTeam().TeamName, { expires: 365 });
            });
        }

        public GetTeams() {
            this.TeamProvider.GetTeams().done((teams) => {
                this.teams(teams);

                var presetTeam = this.getUrlVars()["Team"] || jQuery.cookie('team');
                var newTeam = this.teams()[0];

                for (var ii = 0; ii < this.teams().length; ii++) {
                    var team = this.teams()[ii];
                    if (team.TeamName == presetTeam) {
                        newTeam = team;
                    }
                }

                this.currentTeam(newTeam);
            });
        }

        // Read a page's GET URL variables and return them as an associative array.
        // http://stackoverflow.com/questions/4656843/jquery-get-querystring-from-url
        public getUrlVars() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        }
    }
} 