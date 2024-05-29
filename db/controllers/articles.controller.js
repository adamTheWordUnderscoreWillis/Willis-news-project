const {fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, checkArticleIdExists} = require("../models/articles.models")
exports.getArticleById = (req,res,next) => {
    const { article_id } = req.params;
    
    fetchArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch((err)=> next(err))
    
}
exports.getAllArticles = (req,res, next) =>{
    fetchAllArticles()
    .then((articles)=>{
       return res.status(200).send({articles})
    })
}

exports.getCommentsbyArticleId = (req,res, next)=>{
    const {article_id} = req.params

    const promises = [fetchCommentsByArticleId(article_id), checkArticleIdExists(article_id)]


    Promise.all(promises).then((resolvedPromises)=>{
        const comments = resolvedPromises[0]
        res.status(200).send({comments})
    })
    .catch((err)=> next(err))
}
