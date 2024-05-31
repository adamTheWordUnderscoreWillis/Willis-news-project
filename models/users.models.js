const db = require("../db/connection")

exports.fetchAllUsers = ()=>{
    const queryStatement = `
    SELECT * FROM users
    ORDER BY username ASC
    `
    return db
    .query(queryStatement)
    .then(({rows})=>{
        return rows
    })

}