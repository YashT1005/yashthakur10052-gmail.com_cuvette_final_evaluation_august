require("dotenv").config();
const express = require('express')
const mongoose = require("mongoose");
const cors = require("cors");
const app = express()
const port = 4000

app.get('/', (req, res) => {
    res.send('Hello World!  uuuu')
})

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log("Failed to connect", error));

// health Api
app.get("/run", (req, res) => {
    res.json({
        service: "Pro Manage sever",
        status: "Active",
        time: new Date(),
    });
});

app.use(express.json());

//importing Routes
const user = require('./routes/UserRoutes');
const card = require("./routes/CardRoutes");

//Using routes

app.use('/api/v1', user)
app.use('/api/v1', card)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})