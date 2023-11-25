const dotenv = require("dotenv")
dotenv.config()

module.exports = {
    PORT: process.env.PORT,
    API_KEY: process.env.API_KEY,
    STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
}