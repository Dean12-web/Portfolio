var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const saltRounds = 10

/* GET home page. */

module.exports = (pool) => {
    router.get('/', async function (req, res, next) {
        try {
            const data = await pool.query(`SELECT * FROM users`)
            res.json(data.rows)
            // res.render('admin/dashboard/index', { title: "Dashboard" });
            
        } catch (error) {
            
        }
    });

    router.post('/register', async (req, res, next) => {
        try {
            const { username, email,password, dateofbirth, phone } = req.body
            const hash = bcrypt.hashSync(password, saltRounds);
            let sql = `INSERT INTO users(username,email,password,dateofbirth,phone) VALUES($1,$2,$3,$4,$5)`
            const data = await pool.query(sql, [username, email, hash,dateofbirth, phone])
            res.json(data)
            console.log('ADDING USER DATA SUCCESS')
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error Creating Data User" })
        }
    })
return router
}