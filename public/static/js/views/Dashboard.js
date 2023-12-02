import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.activities = [];

        this.setTitle("Dashboard");

        this.init();
    }

    init() {
        console.log("init dashboard");
        this.getActivities();
    }

    // 2. récupérer les activités de l'utilisateur dans le dossier data et les afficher dans le dashboard
    async getActivities() {
        const stravaToken = localStorage.getItem("stravaToken");
        const stravaTokenParsed = JSON.parse(stravaToken);

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken: stravaTokenParsed.access_token }),
        };
        const response = await fetch("/getActivities", config);
        const data = await response.json();

        this.activities = await this.fetchData();
        console.log(this.activities);
    }


    async fetchData() {
        const resActivities = await fetch("/data/activities.json");
        const data = await resActivities.json();

        return data;
    }
    
}
