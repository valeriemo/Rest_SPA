export default class StravaAuth {
    constructor() {
        this.client_id = 117335;
        this.redirect_uri = "http://localhost:4001/callback";
        this.response_type = "code";
        this.scope = "activity:read_all";
        this.url = `https://www.strava.com/oauth/authorize?client_id=${this.client_id}&redirect_uri=${this.redirect_uri}&response_type=${this.response_type}&scope=${this.scope}`;

        this.init();
    }

    async init() {
        // verifier si le token existe dans le local storage
        const stravaToken = localStorage.getItem("stravaToken");

        if (stravaToken) {
            console.log("token exists");
            // si oui, verifier si le token est encore valide
            if (stravaToken.expires_at < Date.now()) {
                window.location.href = "/dashboard";
            } else {
                // si non, refresh le token
                console.log("token expired");
                await this.refreshToken();
                window.location.href = "/dashboard";
            }
        } else {
            // si non, changer le url pour / (pour que l'utilisateur se connecte)
            this.authorization();
        }
    }

    /**
     * Redirige l'utilisateur vers la page de connexion de Strava
     */
    authorization() {
        window.location.href = this.url;
    }

    async refreshToken() {
        console.log("refresh token");
        const stravaToken = JSON.parse(localStorage.getItem("stravaToken"));
        const refreshToken = stravaToken.refresh_token;
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refresh_token: refreshToken,
            }),
        };
        const response = await fetch("/refreshToken", config);
        const data = await response.json();

        const existingToken = JSON.parse(localStorage.getItem("stravaToken"));
        existingToken.access_token = data.access_token;
        existingToken.expires_at = data.expires_at;
        existingToken.refresh_token = data.refresh_token;
    
        localStorage.setItem("stravaToken", JSON.stringify(existingToken));
    }
}
