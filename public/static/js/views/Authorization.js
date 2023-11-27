import AbstractView from "./AbstractView.js";

export default class extends AbstractView {

    constructor(){
        super();
        this.setTitle("Login");
    }
}

// app.get("/authorization", function (req, res) {
//     const code = req.query.code;
//     const url = `https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;
//     console.log(code);
//     console.log(url);
//     request.post(url, (err, response, body) => {
//         const data = JSON.parse(body);
//         const access_token = data.access_token;
//         const refresh_token = data.refresh_token;
//         const athlete = data.athlete.id;
//         console.log(data);
//         const url = `http://localhost:4001/athlete?access_token=${access_token}&refresh_token=${refresh_token}&athlete=${athlete}`;
//         res.redirect(url);

//         //https://www.strava.com/api/v3/athlete/activities?access_token=acc62722a941a761316f5f57d2f99a9f2ad9d0f8&athlete=49320347
//     });
// });