const {fetchArticleById, fetchAllArticles} = require("../models/articles.models")
exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params;
    
    fetchArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=> {
        next(err)})
    
}
exports.getAllArticles = (req,res, next) =>{
    fetchAllArticles()
    .then((articles)=>{
       return res.status(200).send({articles})
    })
}
