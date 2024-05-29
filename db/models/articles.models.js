const db = require('../connection')
const { getAllArticles } = require('../controllers/articles.controller')

exports.fetchArticleById = (article_id)=>{
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
    exports.fetchAllArticles = ()=>{
        const queryStatment = `
        SELECT articles.*, COUNT(comments.article_id) FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY (articles.article_id)
        ORDER BY article_id DESC;`
        return db
        .query(queryStatment)
        .then(({rows})=> {
            for(let articleIndex = 0; articleIndex<rows.length; articleIndex++){
                const currentArticle = rows[articleIndex]
                currentArticle.comment_count = parseInt(currentArticle.count)
                delete currentArticle.count
            }
              return rows
        })
    }