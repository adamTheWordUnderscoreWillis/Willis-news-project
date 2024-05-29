const express = require('express');
const app = express();
const { getAllTopics } = require('./controllers/topics.controller');
const { getAllEndpoints } = require('./controllers/api.controller');

const { getArticleById, getAllArticles, getCommentsbyArticleId } = require('./controllers/articles.controller');
const { handleCustomErrors, handle404Errors, handleServerErrors, handlePsqlErrors } = require("../db/errorHandling/index.js")

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsbyArticleId);


app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", handle404Errors);

module.exports = app;