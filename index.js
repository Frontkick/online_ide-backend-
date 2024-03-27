const express = require('express');
const {generateFile} = require('./generateFile.js');
const {execute} = require("./execute.js");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true}));

app.get("/", (req,res) => {
    return res.json({hello: "world"});
});

app.post("/run", async (req, res) => {
    const { language = "cpp", code} = req.body;

    if (code === undefined) {
        return res.status(400).json({ success: false, error: "Empty code"});
    }

    try {
            const filepath = await generateFile(language, code)

            const output = await execute(filepath);

            console.log({output});
            return res.json({ filepath, output });
            
    }
    catch(err){
        res.status(500).json({err});
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});

module.exports = app;