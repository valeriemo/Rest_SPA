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
        document.querySelector("#app").style.opacity = 1;
        document.querySelector("#app").style.transition = "all 0.5s ease-in-out";
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
        const calories = this.activity.calories || "Non défini";
        const type = this.activity.type || "Non défini";
        const dateObject = new Date(date);
        const year = dateObject.getFullYear();
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); 
        const day = dateObject.getDate().toString().padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        const speed = this.speedAverage(this.activity.average_speed);
        const duration = this.activity.moving_time; //in seconds
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const distance = this.activity.distance / 1000; //in meters

        activityTemplateText = activityTemplateText
            .replace("{{ title }}", title)
            .replace("{{ date }}", formattedDate)
            .replace("{{ duration }}", duration)
            .replace("{{ pace }}", speed)
            .replace("{{ distance }}", distance.toFixed(2))
            .replace("{{ hours }}", hours)
            .replace("{{ minutes }}", minutes)
            .replace("{{ calories }}", calories)
            .replace("{{ type }}", type);

        return activityTemplateText;
    }

    /**
     * Calcule la vitesse moyenne par km
     * @param {*} speed 
     * @returns 
     */
    speedAverage(speed){
        let speedInKmPerHour = speed * 3.6;
        const timeInMinutes = 60 / speedInKmPerHour;
        const timeInSecondes = timeInMinutes * 60;
        const minutes = Math.floor(timeInMinutes);
        let secondes = Math.round((timeInSecondes % 60));
        return `${minutes}:${secondes}/km`;
    }
}
