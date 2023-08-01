var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
var {isLoggedIn} = require('../helpers/util')
const saltRounds = 10

/* GET home page. */

module.exports = (pool) => {
    router.get('/', isLoggedIn, async function (req, res, next) {
        try {
            res.render('admin/dashboard/index', { title: "My Portfolio", user:req.session.user })
        } catch (error) {
            
        }
    });

    router.post('/register', async (req, res, next) => {
        try {
            const { username, email,password, dateofbirth, phone, address } = req.body
            const hash = bcrypt.hashSync(password, saltRounds);
            let sql = `INSERT INTO users(username,email,password,dateofbirth,phone,address) VALUES($1,$2,$3,$4,$5,$6)`
            const data = await pool.query(sql, [username, email, hash,dateofbirth, phone,address])
            res.json(data)
            console.log('ADDING USER DATA SUCCESS')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error Creating Data User" })
        }
    })
return router
}