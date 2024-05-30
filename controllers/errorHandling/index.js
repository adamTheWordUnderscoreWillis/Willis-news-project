exports.handleCustomErrors = (err,req,res,next)=>{
    if(err.status && err.msg){
       return res.status(err.status).send({ msg: err.msg })
    }
    else next(err);
}
exports.handlePsqlErrors = (err,req,res,next)=>{
    if(err.code === '22P02'){
       return res.status(400).send({ msg: "Ah sorry, you can only input a number!"})
    }
    else if(err.code === '23502'){
        const {column, table} = err
       return res.status(400).send({ msg: `Sorry, but to perform this action on our ${table}, a ${column} input is required!`})
    }
    // else if(err.code === '23503'){
    //    return res.status(400).send({msg: "something" })
    // }
    else next(err);
}

exports.handleServerErrors = (err,req,res,next)=>{
    console.log(err)
       return res.status(500).send({ msg: "Internal Server Error"})
}
exports.handle404Errors = (req, res) =>{
    res.status(404).send({msg: "Does not exist"})
}