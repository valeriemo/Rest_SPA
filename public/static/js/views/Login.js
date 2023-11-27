import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Login");
    }



}

// app.get("/login", function (req, res) {
//     console.log(client_id);
//     res.redirect(
//         `https://www.strava.com/oauth/authorize?client_id=${client_id}&response_type=code&redirect_uri=http://localhost:4001/authorization&approval_prompt=force&scope=activity:read_all`
//     );
// });