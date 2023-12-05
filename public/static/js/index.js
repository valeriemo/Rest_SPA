// Routage frond-end
import Dashboard from "./views/Dashboard.js";
import Activity from "./views/Activity.js";
import StravaAuth from "./utils/StravaAuth.js";
import StravaCallback from "./utils/StravaCallback.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
const getParams = match => {
    const values = match.isMatch.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(isMatch => isMatch[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
}

const router = async () => {
    const routes = [
        { path: "/", utils: StravaAuth }, 
        { path: "/callback", utils: StravaCallback}, 
        { path: "/dashboard", view: Dashboard },
        { path: "/activity/:id", view: Activity },
    ];


    const potentialMatches = routes.map((route) => {
        return {
            route: route,
            isMatch: location.pathname.match(pathToRegex(route.path)),
        };
    });


    let match = potentialMatches.find(
        (potentialMatches) => potentialMatches.isMatch
    );

    // 4. Si aucune correspondance, on utilise la route par défaut
    if (!match) {
        match = {
            route: routes[0],
            isMatch: [location.pathname],
        };
    }

    // Protection de la view
    if(match.route.view){
        const view = new match.route.view(getParams(match));
    }else if(match.route.utils){
        const utils = new match.route.utils();
    }
}

// Fonction pour naviguer vers une URL spécifiée
const navigateTo = url => {
    history.pushState(null, null, url)
    router()
}
//7 Gestion de l'historique du navigateur
window.addEventListener("popstate", router);

// Prévient le rechargement de la page et utilise la fonction navigateTo
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')){
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })
    router();
});