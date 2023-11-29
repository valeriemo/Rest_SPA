// Routage frond-end
import Home from "./views/Home.js";
import Dashboard from "./views/Dashboard.js";
import Authorization from "./views/Authorization.js";
import Callback from "./views/Callback.js";


const routes = [
    { path: "/", view: Home },
    { path: "/authorization", view: Authorization},
    { path: "/callback", view: Callback },
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
}

document.querySelector("#app").innerHTML; // la méthode ;
