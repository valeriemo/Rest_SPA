import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.activities = [];

        this.setTitle("Dashboard");

        (async () => {
            this.activities = await this.fetchData();
            this.init();
        })();
    }

    async init() {
        console.log("init dashboard");
        console.log('activities =', this.activities);

        const html = await this.getHTML();
        document.querySelector("#app").innerHTML = html;
    }


    async fetchData() {
      const response = await fetch("/getData");
        const data = await response.json();
        return data;
    }
    
    async getHTML(){
        return `
        <h1>Dashboard</h1>
        <p>Voici la liste de vos dernières activités</p>
        <p>Nombre d'activités : ${this.activities.length}</p>
        <ul>

        </ul>
        `;
    }

}
