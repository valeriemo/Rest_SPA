import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Dashboard");

        init();
    }

    init() {
        console.log("init dashboard");
        this.getActivities();
    }

    async getActivities() {
        // aller chercher le token dans le local storage
        const access_token = localStorage.getItem('stravaToken');
        console.log(access_token);

        config = {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${access_token}`	
            },
            body: JSON.stringify({ access_token: access_token })
        }
        // appelle l'API pour récupérer les activités de l'utilisateur
        await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=10", config)
        .then(response => response.json())
        .then(activities => {
            console.log(activities);
            return activities;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
}