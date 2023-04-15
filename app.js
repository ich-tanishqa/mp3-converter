const express = require("express");
const fetch = require("node-fetch");
const request = require('request');
require('dotenv').config();



const app = express();


const PORT = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));


app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
app.get("/", (req, res) => {
    res.render("home")
})
app.post("/convert-mp3", async (req, res) => {
    const videoID = req.body.videoID;

    if (videoID === "" | undefined | null) {

        return res.render("home"), { success: false, message: "Please enter a videoID" };

    } else {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`, {
            "method": "GET",
            "headers": {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': process.env.API_HOST
            }
        });
        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === "ok") {
            return res.render("home", { success: true, song_tile: fetchResponse.title, song_link: fetchResponse.link });
        }
        else {
            return res.render("home", { success: false, message: fetchResponse.msg })
        }


    }

})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})