export default class StravaCallback {
    #code = null;
    #token = null;

    constructor() {
        this.#code = null;
        this.#token = null;

        this.init();
    }

    init() {
        console.log("init");
        this.callback();
    }

    getToken() {
        return this.#token;
    }

    callback() {
        console.log("init callback");
        const urlParams = new URLSearchParams(window.location.search);
        this.#code = urlParams.get("code");
        console.log("code: " + this.#code);
        // cacher le code dans l'url
        window.history.replaceState({}, document.title, window.location.origin);
        this.getToken(this.#code);
    }

    async getToken(code) {
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: code }),
        };
        const response = await fetch("/getTokenFromCode", config);
        const data = await response.json();
        // mettre le token dans le local storage
        localStorage.setItem("stravaToken", JSON.stringify(data));
        this.getActivities();
    }

    async getActivities() {
        const stravaToken = localStorage.getItem("stravaToken");
        const stravaTokenParsed = JSON.parse(stravaToken);

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessToken: stravaTokenParsed.access_token,
            }),
        };
        const response = await fetch("/getActivities", config);
        const data = await response.json();
        console.log(data);

        window.location.href = "/dashboard";
    }
}
