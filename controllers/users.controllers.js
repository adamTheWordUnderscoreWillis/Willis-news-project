const { fetchAllUsers } = require("../models/users.models")

exports.getAllUsers = (req, res, next) => {
    fetchAllUsers()
    .then((users)=>{
        return res.status(200).send({users})
    })
}