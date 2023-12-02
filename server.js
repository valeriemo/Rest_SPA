// les points d'entrée de notre serveur et comment il doit réagir aux différentes requêtes HTTP

const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const request = require("request");
const config = require("./config");
const port = config.PORT;
app.use(express.json());



app.listen(port, () => console.log("Server running..."));

/**
 * Middleware qui permet de servir les fichiers statiques
 */
app.use("/static", express.static(path.resolve(__dirname, "public", "static")));

/**
 * Routes qui permettent de récupérer les données de Strava
 */
app.post("/getActivities", (req, res) => {
    const stravaToken = req.body.accessToken;  // Use req.body to access the POST request body

    const url = "https://www.strava.com/api/v3/athlete/activities?per_page=30";

    request.get({
        url: url,
        json: true,
        headers: {
            Authorization: `Bearer ${stravaToken}`,
            accept: "application/json",
        },
    }, (err, response, data) => {
        if (err) {
            console.log("Error:", err);
        } else if (response.statusCode !== 200) {
            console.log("Status:", response.statusCode);
        } else {
            // data is already parsed as JSON:
            console.log(data);
            const activities = data;
            fs.writeFile(
                "./data/activities.json",
                JSON.stringify(activities),
                (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    console.log("File has been created");
                    res.json(activities);
                }
            );
        }
    });
});


/**
 * Route qui permet d'échanger le code d'autorisation contre un token d'accès
 */
app.post("/getTokenFromCode", async (req, res) => {
    const client_id = config.STRAVA_CLIENT_ID;
    const client_secret = config.STRAVA_CLIENT_SECRET;
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
            expires_at,
        });
    });
});

/**
 * Route wildcard qui permet de servir la même page pour toutes les routes
 */
app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});