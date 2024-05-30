const db = require('../db/connection')

exports.checkcommentIdExists =(comment_id)=>{
    const queryStatment = `
    SELECT * FROM comments
    WHERE comment_id = $1`
    return db
    .query(queryStatment, [comment_id])
    .then(({rows})=> {
        if(rows.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: `Comment ${comment_id} does not exist.`
                })
        }

    })
}

exports.deleteCommentById = (comment_id)=>{
    const queryStatment = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING*;`
    const queryValues = [comment_id]

    return db.query(queryStatment, queryValues).then((response)=>{
        return response
    })
}