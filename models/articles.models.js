const db = require('../db/connection')
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
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY (articles.article_id)
        ORDER BY articles.article_id DESC;`
        return db
        .query(queryStatment)
        .then(({rows})=> {
            for(let articleIndex = 0; articleIndex<rows.length; articleIndex++){
                const currentArticle = rows[articleIndex]
                currentArticle.comment_count = currentArticle.count
                delete currentArticle.count
            }
              return rows
        })
    }
    exports.fetchCommentsByArticleId = (article_id)=>{
        const queryStatment = `
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`
        return db
        .query(queryStatment, [article_id])
        .then(({rows})=> {
              return rows
        })
    }
    exports.checkArticleIdExists =(article_id)=>{
        const queryStatment = `
        SELECT * FROM articles
        WHERE article_id = $1`
        return db
        .query(queryStatment, [article_id])
        .then(({rows})=> {
            if(!rows[0]){
                    return Promise.reject({
                        status: 404,
                        msg: `Article ${article_id} does not exist.`
                    })
            }
        })    
    }
    exports.checkUserExists = (body)=>{
        const {username}  = body
        const queryStatment = `
        SELECT * FROM users
        WHERE username = $1`
        return db
        .query(queryStatment, [username])
        .then(({rows})=> {
            if(!rows[0]){
                    return Promise.reject({
                        status: 400,
                        msg: `The username ${username} does not exist.`
                    })
            }
        })
    }

    exports.addCommentsByArticleId = (article_id, comment)=>{
        const { body, username } = comment
        const queryStatment = `
        INSERT INTO COMMENTS
        (body, article_id, author)
        VALUES
        ($1, $2, $3)
        RETURNING body`
        const queryValues = [body, article_id, username]

        return db
        .query(queryStatment, queryValues)
        .then(({rows})=>{
            const comment = rows[0]
            return comment
        })
    }
    exports.insertArticleVotes = (article_id, body) =>{
        const {inc_votes} = body
        const queryStatment = `
        UPDATE articles
            SET
            votes = votes + $1
            WHERE article_id = $2
        RETURNING*;
        `
        const queryValues = [inc_votes, article_id]
        return db
        .query(queryStatment, queryValues)
        .then(({rows})=>{
            const article = rows[0]
            return article
        })
    }