const express = require('express');
const app = express();
const { getAllTopics } = require('../controllers/topics.controller.js');
const { getAllEndpoints } = require('../controllers/api.controller.js');
const { getArticleById, getAllArticles, getCommentsbyArticleId, createCommentsByArticleId, updateArticleVotes } = require('../controllers/articles.controller.js');
const { handleCustomErrors, handle404Errors, handleServerErrors, handlePsqlErrors } = require("../controllers/errorHandling/index.js");
const { removeCommentById } = require('../controllers/comments.controller.js');
const { getAllUsers } = require('../controllers/users.controllers.js');

app.use(express.json())

app.get('/api/topics', getAllTopics);
app.get('/api', getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsbyArticleId);
app.get("/api/users", getAllUsers)

app.post("/api/articles/:article_id/comments", createCommentsByArticleId);

app.patch("/api/articles/:article_id", updateArticleVotes);

app.delete("/api/comments/:comment_id", removeCommentById)



app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

app.all("*", handle404Errors);

module.exports = app;