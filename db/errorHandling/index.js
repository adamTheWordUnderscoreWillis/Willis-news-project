exports.handleCustomErrors = (err,req,res,next)=>{
    if(err.status && err.msg){
       return res.status(err.status).send({ msg: err.msg })
    }
    else next(err);
}
exports.handlePsqlErrors = (err,req,res,next)=>{
    if(err.code === '22P02'){
       return res.status(400).send({ msg: "The article id must be an integer"})
    }
    else next(err);
}

exports.handleServerErrors = (err,req,res,next)=>{
    console.log(err)
       return res.status(500).send({ msg: "Internal Server Error"})
}
exports.handle404Errors = (req, res) =>{
    res.status(404).send({msg: "Does not exist"})
}