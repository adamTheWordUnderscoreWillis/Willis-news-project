exports.handleCustomErrors = (err,req,res,next)=>{
    if(err.status && err.msg){
       return res.status(err.status).send({ msg: err.msg })
    }
    else next(err);
}

exports.handle404Errors = (req, res) =>{
    res.status(404).send({msg: "Does not exist"})
}