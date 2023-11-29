import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Authorization");

        this.init();
    }

  
    init(){
        console.log("init");
        // redirection vers la page d'authorization de strava
        window.location.href = `https://www.strava.com/oauth/authorize?client_id=117335&redirect_uri=http://localhost:4001/callback&response_type=code&scope=activity:read_all`;
    }

   
}