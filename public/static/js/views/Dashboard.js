import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.activities;
        this.athlete;

        this.setTitle("Dashboard");

        (async () => {
            this.activities = await this.fetchData();
            this.athlete = await this.fetchAthlete();
            this.init();
        })();
    }

    async init() {
        // verifier si le token existe dans le local storage
        const stravaToken = localStorage.getItem("stravaToken");
        if(!stravaToken) {
            window.location.href = "/";
        }
        console.log("activities =", this.activities);
        console.log("athlete =", this.athlete);
        const html = await this.getHeader();
        document.querySelector("#app").innerHTML = html;
    }

    async fetchAthlete() {
        let accessToken = localStorage.getItem("stravaToken");
        accessToken = JSON.parse(accessToken).access_token;

        const config = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await fetch(
            "https://www.strava.com/api/v3/athlete",
            config
        );
        const data = await response.json();
        return data;
    }

    async fetchData() {
        const response = await fetch("/getData");
        const data = await response.json();
        return data;
    }

    async getHeader() {
        const appHeader = await fetch(
            "/static/layouts/templates/app-header.html"
        );
        let headerTemplate = await appHeader.text();

        //nullish-coalescing-operator
        const firstname = this.athlete.firstname || "Non défini";
        const lastname = this.athlete.lastname || "Non défini";
        const username = this.athlete.username || "Non défini";
        const bio = this.athlete.bio || "Non défini";
        const moisFormatter = new Intl.DateTimeFormat("fr-FR", {
            month: "long",
        });
        const dateAujourdhui = new Date();
        const mois = moisFormatter.format(dateAujourdhui);

        headerTemplate = headerTemplate.replace("{{ firstname }}", firstname);
        headerTemplate = headerTemplate.replace("{{ lastname }}", lastname);
        headerTemplate = headerTemplate.replace("{{ Username }}", username);
        headerTemplate = headerTemplate.replace("{{ bio }}", bio);
        headerTemplate = headerTemplate.replace("{{ Mois }}", mois);
        headerTemplate = headerTemplate.replace("{{ Date }}", dateAujourdhui);

        return headerTemplate;
    }

    async getStats() {
        const appStats = await fetch(
            "/static/layouts/templates/app-stats.html"
        );
        let statsTemplate = await appStats.text();
    }

    async getActivities() {
        const appActivities = await fetch(
            "/static/layouts/templates/app-activities.html"
        );
        let activitiesTemplate = await appActivities.text();

        return activitiesTemplate;
    }


}
