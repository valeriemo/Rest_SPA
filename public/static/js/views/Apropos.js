import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("A propos");

        this.init();
    }

    
    async init() {
        const template = await fetch("/static/layouts/templates/app-apropos.html");
        let templateText = await template.text();
        document.querySelector("#app").innerHTML = templateText;
    }
}

