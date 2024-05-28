const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics.controller');
const { getEndpoints } = require('./controllers/api.controller');



app.get('/api/topics', getTopics);
app.get('/api', getEndpoints);

app.all("*", (req, res) =>{
    res.status(404).send({msg: "Does not exist"})
})

module.exports = app;