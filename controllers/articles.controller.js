const {fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, checkArticleIdExists, addCommentsByArticleId, checkUserExists} = require("../models/articles.models")
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

exports.createCommentsByArticleId = (req,res,next)=>{
    const { article_id } = req.params
    const { body } = req

    const promises = [checkArticleIdExists(article_id), checkUserExists(body),  addCommentsByArticleId(article_id, body)]
    Promise.all(promises)
    .then((resolvedPromises)=>{
        const comment = resolvedPromises[2]
        res.status(200).send({comment})
    })
    .catch((err)=> {
        next(err)
    })
}
