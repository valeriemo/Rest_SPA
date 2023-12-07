import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.activities;
        this.setTitle("Activites");
        this.appHtml = document.querySelector("#app");

        this.init();
    }

    async init() {
        this.activities = await this.fetchData();
        const html = await this.getHtml();
        const header = `<h1>Activités des 2 derniers mois</h1>`;
        const button = `<a data-link href="/dashboard" class="button-1 variant-1">Retour au dashboard</a>`;
        const elDiv = document.createElement("div");
        elDiv.classList.add("container-activity");
        elDiv.innerHTML = html;
        this.appHtml.innerHTML = header;
        this.appHtml.appendChild(elDiv);
        this.appHtml.insertAdjacentHTML("beforeend", button);
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

    getHtml() {
        const formattedDate = new Intl.DateTimeFormat("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        let html = "";

        this.activities.reverse().forEach((activity) => {
            const date = new Date(activity.start_date);
            const formattedDateValue = formattedDate.format(date);
            const distance = (activity.distance / 1000).toFixed(2);
            const name = activity.name;
            const path = this.origin;
            html += `<article class="tile-activity">
                        <div class="tile-activity-header">
                            <small>${formattedDateValue}</small>
                            <h3>${name}</h3>
                            <p>${distance} Km</p>
                        </div>
                        <a data-link href="${path}/activity/${activity.id}" class="button-1">Voir</a>
                    </article>`;
        });
        return html;
    }
}
