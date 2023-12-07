import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super();
        this.setTitle("A propos");

        this.init();
    }

    
    async init() {
        document.querySelector("#app").style.opacity = 1;
        document.querySelector("#app").style.transition = "all 0.5s ease-in-out";
        const template = await fetch("/static/layouts/templates/app-apropos.html");
        let templateText = await template.text();
        document.querySelector("#app").innerHTML = templateText;
    }
}

