var express = require('express');
var router = express.Router();
var path = require('path');
var { isLoggedIn } = require('../helpers/util')

/* GET users listing. */
module.exports = (pool) => {

    router.get('/', isLoggedIn, function (req, res, next) {
        res.render('admin/post/index', { title: "Post", user: req.session.user })
    });

    router.get('/add', async function (req, res, next) {
        try {
            const username = await pool.query(`SELECT * FROM users`)
            res.render('admin/post/form', { title: "Post", header: "Form Add", user: req.session.user, username: username.rows })
        } catch (error) {
            console.log(error)
        }
    })

    router.post('/add', async function (req, res, next) {
        try {
            const { userid } = req.session.user
            const { title, body, imageone } = req.body
            const sampleFile = req.files.imageone;
            const fileName = `${Date.now()}-${sampleFile.name}`;
            const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
            sampleFile.mv(uploadPath, function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err)
                }
            })
            const sql = `INSERT INTO portfolios(title,body,imageone, userid) VALUES($1,$2,$3,$4)`
            const data = await pool.query(sql, [title, body, fileName, userid])
            console.log("Success ADD data", data.rows[0])
            res.redirect('/posts')
        } catch (error) {
            console.log(error)
        }
    })
    return router;
}
