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
        console.log("init dashboard");
        console.log('activities =', this.activities);
        console.log('athlete =', this.athlete);
        const html = await this.getHTML();
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
        const response = await fetch("https://www.strava.com/api/v3/athlete", config);
        const data = await response.json();
        return data;
    }

    async fetchData() {
      const response = await fetch("/getData");
        const data = await response.json();
        return data;
    }
    
    async getHTML(){
        return `
        <h1>Dashboard</h1>
        <p>Voici la liste de vos dernières activités</p>
        <p>Nombre d'activités : ${this.activities.length}</p>
        <ul>

        </ul>
        `;
    }

}
