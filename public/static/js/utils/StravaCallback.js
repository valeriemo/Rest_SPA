export default class StravaCallback {
    #code = null;
    #token = null;

    constructor() { 
        this.#code = null;
        this.#token = null;

        this.init();
    }

    init(){
        console.log("init");
        this.callback();
    }

    
    getToken() {
        return this.#token;
    }

    callback(){
        console.log("init callback");
        const urlParams = new URLSearchParams(window.location.search);
        this.#code = urlParams.get("code");
        console.log("code: " + this.#code); 
        // cacher le code dans l'url
        window.history.replaceState({}, document.title, window.location.origin);
        this.getToken(this.#code);
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
        console.log("config:" + JSON.stringify(config));

        const response = await fetch("/getTokenFromCode", config);
        const data = await response.json();

        // Utilisez la variable 'data' pour accéder aux données JSON de la réponse.
        console.log(JSON.stringify(data));

        // mettre le token dans le local storage
        localStorage.setItem("stravaToken", JSON.stringify(data));

        // changer le url pour /dashboard (je recois l'object)
        TODO://je vais devoir mettre l'objet dans fichier json pour pouvoir le lire dans le dashboard
        history.pushState(null, null, "/dashboard");
    }
}