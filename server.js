
const express = require('express')
const cors = require("cors")

const app = express();

app.use(express.json());

app.use(cors({
origin: '*',
methods: ["GET", "POST", "UPDATE", "DELETE"]

}))

require("./config/config")


require("dotenv").config()

const route = require("./router/route")

const port = process.env.port

app.get('/', (req, res) => {
    res.send("Welcome to job finder");
})
app.use('/api/v1', route )

app.listen(port, ()=>{
    console.log (`server is up and running on ${port} `)
} )