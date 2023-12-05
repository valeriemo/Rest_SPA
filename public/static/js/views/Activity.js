import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("Activity");
        this.id = params.id;
        this.activity;

        (async () => {
            this.activity = await this.fetchDataById();
            this.init();
        })();
    }

    /**
     * Initialise la page d'une activité    
     */
    async init() {
        // verifier si le token existe dans le local storage
        const stravaToken = localStorage.getItem("stravaToken");
        if (!stravaToken) {
            window.location.href = "/";
        }
        console.log(this.id);
        console.log(this.activity);
        const template = await this.getTemplate();
        document.querySelector("#app").innerHTML = template;
    }

    /**
     * Va chercher les activités de l'athlète dans le json et cherche avec l'id
     * @returns {Promise} data - les activités de l'athlète
     */
    async fetchDataById() {
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch("/getData", config);
        const data = await response.json();
        const post = data.find((item) => item.id == this.id);
        return post;
    }
    
    /**
     * 
     * @returns {Promise} data - le template de la page activity
     */
    async getTemplate() {
        const activityTemplate = await fetch(
            "/static/layouts/templates/app-activity.html"
        );
        let activityTemplateText = await activityTemplate.text();

        const title = this.activity.name || "Non défini";
        const date = this.activity.start_date_local || "Non défini";
        const elevation = this.activity.total_elevation_gain || "Non défini";
        const calories = this.activity.calories || "Non défini";
        const type = this.activity.type || "Non défini";

        
        const duration = this.activity.moving_time; //in seconds
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const distance = this.activity.distance / 1000; //in meters
        let pace = distance / (duration / 3600);
        //pace = pace.toFixed(2);


        activityTemplateText = activityTemplateText
            .replace("{{ title }}", title)
            .replace("{{ date }}", date)
            .replace("{{ duration }}", duration)
            .replace("{{ pace }}", pace)
            .replace("{{ distance }}", distance.toFixed(2))
            .replace("{{ hours }}", hours)
            .replace("{{ minutes }}", minutes)
            .replace("{{ elevation }}", elevation)
            .replace("{{ calories }}", calories)
            .replace("{{ type }}", type);

        return activityTemplateText;
    }
}
