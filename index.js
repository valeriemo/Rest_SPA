// les points d'entrée de notre serveur et comment il doit réagir aux différentes requêtes HTTP

const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const fs = require("fs");
const request = require("request");
const config = require("./config");

const port = config.PORT;
const api_key = config.API_KEY;
const client_id = config.STRAVA_CLIENT_ID;
const client_secret = config.STRAVA_CLIENT_SECRET;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log("Server running..."));

// On doit créer une exeption pour le dossier public (css, js, img, etc)
app.use('/static', express.static(path.resolve(__dirname, 'public', 'static')))

// Routes
app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});



// app.get("/authorization", function (req, res) {
//     const code = req.query.code;
//     const url = `https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;
//     console.log(code)
//     console.log(url)
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