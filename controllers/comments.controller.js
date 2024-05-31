const { deleteCommentById, checkcommentIdExists } = require("../models/comments.models")

exports.removeCommentById = (req,res,next) =>{
    const {comment_id} = req.params

    checkcommentIdExists(comment_id)
    .then(()=>{
        return deleteCommentById(comment_id)
    })
    .then(()=>{
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })

    


}