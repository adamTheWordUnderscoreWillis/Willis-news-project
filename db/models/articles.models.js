const db = require('../connection')

function fetchArticleById(article_id){
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

module.exports = { fetchArticleById }