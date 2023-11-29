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


// route pour avoir les tokens d'acces et de refresh
app.post("/getTokenFromCode", async (req, res) => {

    console.log("code: " + req.body.code);
    const code = req.body.code;
    const url = `https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`;

    await request.post(url, (err, response, body) => {
        if (err) {
            return res.status(500).send("Error during Strava token exchange");
        }

        const data = JSON.parse(body);
        const access_token = data.access_token;
        const refresh_token = data.refresh_token;
        const athlete = data.athlete.id;
        const expires_at = data.expires_at;

        // debug block
        console.log("access_token: " + access_token);
        console.log("refresh_token: " + refresh_token);
        console.log("athlete: " + athlete);
        console.log("expires_at: " + expires_at);

        res.json({
            access_token,
            refresh_token,
            athlete,
            expires_at
        });
    });
});

// Routes
app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});
