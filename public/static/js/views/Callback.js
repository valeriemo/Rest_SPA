import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super();
        this.setTitle("Callback");
        this.init();
    }

    init() {
        console.log("init callback");
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        // cacher le code dans l'url
        window.history.replaceState({}, document.title, window.location.origin);
        this.getToken(code);
    }

    async getToken(code) {
        console.log("code: " + code);

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: code }),
        };
        console.log("congif:" + JSON.stringify(config));

        const response = await fetch("/getTokenFromCode", config);
        const data = await response.json();

        // Utilisez la variable 'data' pour accéder aux données JSON de la réponse.
        console.log(data);

        // mettre le token dans le local storage
        localStorage.setItem("stravaToken", data);

        // changer le url pour /dashboard (je recois l'object)
        TODO://je vais devoir mettre l'objet dans fichier json pour pouvoir le lire dans le dashboard
        history.pushState(null, null, "/dashboard");
    }
}
