const db = require('../connection')

function fetchArticleById(article_id){
    const numCheckRegex = /\d/gi
    if(numCheckRegex.test(article_id) === false){
        return Promise.reject({
            status: 400,
            msg: `'${article_id}' is not a valid input. Please use a number.`
        })
    }
    else{
    const queryStatment = 'SELECT * FROM articles WHERE article_id = $1'
    return db
    .query(queryStatment,[article_id])
    .then(({rows})=> {
        const article = rows[0]
        if(!article){
            return Promise.reject({
                status: 404,
                msg: `Article ${article_id} does not exist.`
            })
        }
          return article
        })
    }
}

module.exports = { fetchArticleById }