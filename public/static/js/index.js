// Routage frond-end
import Home from "./views/Home.js";
import Dashboard from "./views/Dashboard.js";
import StravaAuth from "./utils/StravaAuth.js";
import StravaCallback from "./utils/StravaCallback.js";

// verifie dans le local storage si le token existe
const routes = [
    { path: "/", utils: StravaAuth }, //exception pour la route de callback    
    { path: "/callback", utils: StravaCallback}, //exception pour la route de callback
    { path: "/dashboard", view: Dashboard },
];


const potentialMatches = routes.map((route) => {
    return {
        route: route,
        isMatch: location.pathname === route.path,
    };
});


let match = potentialMatches.find(
    (potentialMatches) => potentialMatches.isMatch
);

if (!match) {
    match = {
        route: routes[0],
        isMatch: true,
    };
}

// Protection de la view
if(match.route.view){
    const view = new match.route.view();
}else if(match.route.utils){
    const utils = new match.route.utils();
}

document.querySelector("#app").innerHTML; // la méthode ;
