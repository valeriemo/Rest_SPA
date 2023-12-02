export default class StravaAuth {

    constructor() {
        this.client_id = 117335;
        this.redirect_uri = "http://localhost:4001/callback";
        this.response_type = "code";
        this.scope = "activity:read_all";
        this.url = `https://www.strava.com/oauth/authorize?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=${this.response_type}&scope=${this.scope}`;

        this.init();
    }

    init() {
        console.log("init");
        // verifier si le token existe dans le local storage
        const stravaToken = localStorage.getItem("stravaToken");
        // delete le token dans le local storage
        localStorage.removeItem("stravaToken");
        console.log(stravaToken);

        if (stravaToken) {
            console.log("token exists");
            // si oui, verifier si le token est encore valide
            // si oui, changer le url pour /dashboard
            // si non, changer le url pour / (pour que l'utilisateur se reconnecte)
        } else {
                // si non, changer le url pour / (pour que l'utilisateur se connecte)
                this.authorization();
            }
        }


    // 1.redirection vers la page d'authorization de strava
    authorization() {
        window.location.href = this.url;
    }

    
}
