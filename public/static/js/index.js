// Routage frond-end
import Home from "./views/Home.js";
import Login from "./views/Login.js";
import Authorization from "./views/Authorization.js";

const routes = [
    { path: "/", view: Home },
    { path: "/login", view: Login},
    { path: "/authorization", view: Authorization },
];

const potentialMatches = routes.map((route) => {
    return {
        route: route,
        isMatch: location.pathname === route.path,
    };
});

let match = potentialMatches.find((potentialMatches) => potentialMatches.isMatch);

if (!match) {
    match = {
        route: routes[0],
        isMatch: true,
    };
}

const view = new match.route.view();
document.querySelector("#app").innerHTML // la méthode ;



