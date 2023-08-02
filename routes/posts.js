var express = require('express');
var router = express.Router();
var path = require('path');
var { isLoggedIn } = require('../helpers/util')

/* GET users listing. */
module.exports = (pool) => {

    router.get('/',isLoggedIn, async function (req, res, next) {
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

    router.get('/datatable', async (req, res, next) => {
        let params = []

        if (req.query.search.value) {
            params.push(`title ilike '%${req.query.search.value}%'`)
        }

        const limit = req.query.length
        const offset = req.query.start
        const sortBy = req.query.columns[req.query.order[0].column].data
        const sortMode = req.query.order[0].dir
        const sqlData = `SELECT * FROM portfolios${params.length > 0 ? ` WHERE ${params.join(' OR ')}` : ''} ORDER BY ${sortBy} ${sortMode} limit ${limit} offset ${offset} `
        const sqlTotal = `SELECT COUNT(*) as total FROM portfolios${params.length > 0 ? ` WHERE ${params.join(' OR ')}` : ''}`
        const total = await pool.query(sqlTotal)
        const data = await pool.query(sqlData)
        console.log(total.rows[0].total)

        const response = {
            "draw": Number(req.query.draw),
            "recordsTotal": total.rows[0].total,
            "recordsFiltered": total.rows[0].total,
            "data": data.rows
        }

        res.json(response)
    })
    return router;
}
