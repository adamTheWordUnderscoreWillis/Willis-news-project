const db = require('../db/connection')
const { getAllArticles } = require('../controllers/articles.controller')
const { createRef } = require('../db/seeds/utils')

exports.fetchArticleById = (article_id)=>{
    const queryStatment = `
    SELECT articles.*, COUNT(comments.article_id) 
    FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY (articles.article_id);
    `
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
            article.comment_count = article.count
            delete article.count
            return article
        })

}
    exports.fetchAllArticles = (query)=>{
        
        const greenList = ["author", "topic", "sort_by","order"]
        const {topic, sort_by = "articles.article_id", order = "DESC"} = query
        const queryValues = []
        let queryStatment = `
        SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id`
        const queryGroupBy = `
        GROUP BY (articles.article_id)`
        const queryOrderBy = `
        ORDER BY ${sort_by} ${order}`

        const QueryKeys = Object.keys(query)
        for(let i = 0; i<QueryKeys.length; i++){
            const currentKey = QueryKeys[i]
            
            if(currentKey && !greenList.includes(currentKey)){
                return Promise.reject({
                    status: 400,
                    msg: `That query is not valid`
                })
            }
        }
        if (!["created_at", "count", "votes","articles.article_id", "author"].includes(sort_by)) {
            return Promise.reject({ status: 400, msg: 'Invalid sort query' });
          }
          if (!["ASC", "DESC"].includes(order)) {
            return Promise.reject({ status: 400, msg: 'Invalid order query' });
          }
        if(topic){
            queryValues.push(topic)
            queryStatment += `
            WHERE topic = $1`
        }
        queryStatment += queryGroupBy + queryOrderBy
        return db
        .query(queryStatment,queryValues)
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
    exports.checkTopicExists = (query)=>{
        const {topic} = query
        const queryStatment = `
        SELECT * FROM topics
        WHERE slug = $1`
        return db
        .query(queryStatment, [topic])
        .then(({rows})=> {
            if(!rows[0]){
                    return Promise.reject({
                        status: 400,
                        msg: `The Topic "${topic}" is not one we cover I'm afraid.`
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