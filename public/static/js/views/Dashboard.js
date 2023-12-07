import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.activities;
        this.athlete;
        this.dateToday = new Date();
        this.thisMonth = this.dateToday.getMonth() + 1;
        this.activitiesThisMonth = [];
        this.activitiesLastMonth = [];

        this.setTitle("Dashboard");

        (async () => {
            this.activities = await this.fetchData();
            this.athlete = await this.fetchAthlete();
            
            // Utilisation de .then pour appeler init() une fois que les données sont prêtes
            Promise.resolve().then(() => {
                this.init();
            });
        })();
    }

    /**
     * Initialise la page dashboard
     */
    async init() {
        const stravaToken = localStorage.getItem("stravaToken");
        if(!stravaToken) {
            window.location.href = "/";
        }
        document.querySelector("#app").style.opacity = 1;
        document.querySelector("#app").style.transition = "all 0.5s ease-in-out";
        const html = await this.getHeader();
        const stats = await this.getStats();
        const activities = await this.getActivities();
        document.querySelector("#app").innerHTML = html;
        document.querySelector("#app").insertAdjacentHTML('beforeend', stats);
        document.querySelector("#app").insertAdjacentHTML('beforeend', activities);
    }

    /**
     * Appel a l'api pour avoir les informations de l'athlète
     * @returns {Promise} data - les informations de l'athlète
     */
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

    /**
     * Va chercher les activités de l'athlète dans le json
     * @returns {Promise} data - les activités de l'athlète
     */
    async fetchData() {
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await fetch("/getData", config);
        const data = await response.json();
        return data;
    }

    /**
     * 
     * @returns {Promise} headerTemplate - le template de la section header
     */
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
        const formattedMonth = new Intl.DateTimeFormat("fr-FR", {
            month: "long",
        });
        const mois = formattedMonth.format(this.dateToday);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('fr-FR', options);
        const formattedDate = formatter.format(this.dateToday);
        headerTemplate = headerTemplate.replace("{{ firstname }}", firstname);
        headerTemplate = headerTemplate.replace("{{ lastname }}", lastname);
        headerTemplate = headerTemplate.replace("{{ Username }}", username);
        headerTemplate = headerTemplate.replace("{{ bio }}", bio);
        headerTemplate = headerTemplate.replace("{{ Mois }}", mois);
        headerTemplate = headerTemplate.replace("{{ Date }}", formattedDate);
        headerTemplate = headerTemplate.replace("{{ path }}", this.origin);
        return headerTemplate;
    }

    /**
     * Va chercher le template de la section stats
     * @returns {Promise} statsTemplate - le template de la section stats
     */
    async getStats() {
        const appStats = await fetch(
            "/static/layouts/templates/app-stats.html"
        );
        let statsTemplate = await appStats.text();

        //Séparer les activités en 2 tableaux pour selon le mois
        const moisDernier = this.thisMonth - 1;
        this.activities.forEach((activity) => {
            const date = new Date(activity.start_date);
            const monthlyActivities = date.getMonth() + 1;
            if (monthlyActivities === this.thisMonth) {
                this.activitiesThisMonth.push(activity);
            } else if (monthlyActivities === moisDernier) {
                this.activitiesLastMonth.push(activity);
            }
        }); 
        // Nb activités
        const nbActivitiesMonth = this.activitiesThisMonth.length;
        const nbactivitiesLastMonth = this.activitiesLastMonth.length;
        // Total KM
        const totalKmThisMonth = this.calculKm(this.activitiesThisMonth);
        const totalKmLastMonth = this.calculKm(this.activitiesLastMonth);
        // Moyenne KM
        const averageKmMonth = this.moyenneKm(this.activitiesThisMonth);
        const averageKmLastMonth = this.moyenneKm(this.activitiesLastMonth);
        // Cadence
        const cadenceAverageMonth = this.cadenceAverage(this.activitiesThisMonth);
        const cadenceAverageLastMonth = this.cadenceAverage(this.activitiesLastMonth);
        //Speed
        const speedAverageMonth = this.speedAverage(this.activitiesThisMonth);
        const speedAverageLastMonth = this.speedAverage(this.activitiesLastMonth);

        statsTemplate = statsTemplate.replace('{{ totalKmThisMonth }}', totalKmThisMonth);
        statsTemplate = statsTemplate.replace('{{ totalKmLastMonth }}', totalKmLastMonth);
        statsTemplate = statsTemplate.replace('{{ nbActivitiesMonth }}', nbActivitiesMonth);
        statsTemplate = statsTemplate.replace('{{ nbactivitiesLastMonth }}', nbactivitiesLastMonth);
        statsTemplate = statsTemplate.replace('{{ averageKmMonth }}', averageKmMonth);
        statsTemplate = statsTemplate.replace('{{ averageKmLastMonth }}', averageKmLastMonth);
        statsTemplate = statsTemplate.replace('{{ speedThisMonth }}', speedAverageMonth);
        statsTemplate = statsTemplate.replace('{{ speedLastMonth }}', speedAverageLastMonth);
        statsTemplate = statsTemplate.replace('{{ cadenceThisMonth }}', cadenceAverageMonth);
        statsTemplate = statsTemplate.replace('{{ cadenceLastMonth }}', cadenceAverageLastMonth);
        return statsTemplate;
    }

    /**
     * 
     * @returns {Promise} activitiesTemplate - le template de la section activities
     */
    async getActivities() {
        const appActivities = await fetch(
            "/static/layouts/templates/app-activities.html"
        );
        let activitiesTemplate = await appActivities.text();

        // je veux aller cherche les 5 derniers activités
        const derniersCinqActivites = this.activities.slice(-5);
        // je veux calculer les stats de ces 5 dernières activités
        derniersCinqActivites.reverse().forEach(activity => {
            const date = new Date(activity.start_date);
            const formattedDate = new Intl.DateTimeFormat("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            const id = activity.id;
            const formattedDateValue = formattedDate.format(date);
            const distance = (activity.distance / 1000).toFixed(2);
            const name = activity.name;
            activitiesTemplate = activitiesTemplate.replace('{{ title }}', name);
            activitiesTemplate = activitiesTemplate.replace('{{ totalKm }}', distance);
            activitiesTemplate = activitiesTemplate.replace('{{ formattedDate }}', formattedDateValue);
            activitiesTemplate = activitiesTemplate.replace('{{ distance }}', distance);
            activitiesTemplate = activitiesTemplate.replace('{{ id }}', id);
            activitiesTemplate = activitiesTemplate.replace('{{ path }}', this.origin);
        });
        return activitiesTemplate;
    }

    /**
     * @param {Array} activities - les activités de l'athlète
     * @returns {Number} totalKm - le total de km parcourus
     */
    calculKm(activities){
        let totalKm = 0;
       // les km sont en mètres
         activities.forEach(activity => {
              totalKm += activity.distance;
         });
         totalKm = (totalKm / 1000).toFixed(2);
        return totalKm;
    }

    /**
     * Calcul la moyenne total de km par activité
     * @param {*} activities 
     * @returns 
     */
    moyenneKm(activities){
        let moyenneKm = 0;
        const nbActivites = activities.length;
        const totalKm = this.calculKm(activities);
        moyenneKm = (totalKm / nbActivites).toFixed(2);
        return moyenneKm;
    }

    /**
     * Calcul la moyenne de cadence des activités
     * @param {*} activities 
     * @returns 
     */
    cadenceAverage(activities){
        let cadenceAverage = 0;
        const nbActivites = activities.length;
        let totalCadence = 0;
        activities.forEach(activity => {
            totalCadence += activity.average_cadence;
            console.log(activity)
        });
        cadenceAverage = (totalCadence / nbActivites).toFixed(0);
        return cadenceAverage;
    }

    /**
     * Calcul la moyenne de vitesse par KM des activités
     * @param {*} activities 
     * @returns 
     */
    speedAverage(activities){
        let speedAverage = 0;
        const nbActivites = activities.length;
        let totalSpeed = 0;
        activities.forEach(activity => {
            totalSpeed += activity.average_speed;
        });
        let speedInKmPerHour = (totalSpeed / nbActivites) * 3.6;
        const timeInMinutes = 60 / speedInKmPerHour;
        const timeInSecondes = timeInMinutes * 60;
        const minutes = Math.floor(timeInMinutes);
        let secondes = Math.round((timeInSecondes % 60));
        if(secondes.toString().length === 1){
            secondes = `${secondes}0`;
        }
        return `${minutes}:${secondes}/km`;
    }


}
