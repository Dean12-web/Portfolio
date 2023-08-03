var express = require('express');
var router = express.Router();
var path = require('path');
var { isLoggedIn } = require('../helpers/util')

/* GET users listing. */
module.exports = (pool) => {

    router.get('/', isLoggedIn, async function (req, res, next) {
        res.render('admin/post/index', { title: "Post", user: req.session.user })
    });
    router.get('/add', async function (req, res, next) {
        try {
            res.render('admin/post/form', { title: "Post", header: "Form Add", info: req.flash('info'), user: req.session.user, data: {} })
        } catch (error) {
            console.log(error)
        }
    })

    router.post('/add', isLoggedIn, async function (req, res, next) {
        try {
            const { userid } = req.session.user;
            const { title, body, github } = req.body;
            if (!req.files || Object.keys(req.files).length === 0) {
                req.flash('info', 'Please Pick A Picture')
                return res.redirect('/posts/add')
            }
            const sampleFile = req.files.imageone;
            const fileName = `${Date.now()}-${sampleFile.name}`;
            const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
    
            sampleFile.mv(uploadPath, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }
            });
    
            const sql = `INSERT INTO portfolios(title, github, body, imageone, userid) VALUES($1, $2, $3, $4, $5)`;
            const data = await pool.query(sql, [title, github, body, fileName, userid]);
            console.log("Success ADD data", data.rows[0]);
    
            res.redirect('/posts');
        } catch (error) {
            console.log(error);
        }
    });
    

    router.get('/edit/:portfolioid', isLoggedIn, async (req, res, next) => {
        try {
            const { portfolioid } = req.params
            const sql = `SELECT * FROM portfolios WHERE portfolioid = $1`;
            const data = await pool.query(sql, [portfolioid])
            res.render('admin/post/form', { title: "Post", header: "Form Edit", info: req.flash('info'), user: req.session.user, data: data.rows[0] })
        } catch (error) {
            console.log(error)
        }
    })

    router.post('/edit/:portfolioid', isLoggedIn, async (req, res, next) => {
        try {
            const { portfolioid } = req.params
            const { title, body,github } = req.body
            if (!req.files || !req.files.picture) {
                // No file was uploaded, proceed with updating other fields
                await pool.query(`UPDATE portfolios SET title = $1, github=$2 body=$3  WHERE portfolioid = $4`, [title,github, body, portfolioid]);
                console.log('Data Goods Updated');
                return res.redirect('/posts');
            }
            const sampleFile = req.files.imageone;
            const fileName = `${Date.now()}-${sampleFile.name}`;
            const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
            sampleFile.mv(uploadPath, function (err) {
                if (err) {
                    console.log(err)
                    return res.status(500).send(err)
                }
            })
            const sql = `UPDATE portfolios SET title = $1, github = $3 body = $4, imageone = $5 WHERE portfolioid = $6`;
            await pool.query(sql, [title, github, body, fileName, portfolioid])
            res.redirect('/posts')
        } catch (error) {
            console.log(error)
        }
    })
    router.get('/delete/:portfolioid', async (req, res, next) => {
        try {
            const { portfolioid } = req.params
            const sql = `DELETE FROM portfolios WHERE portfolioid = $1`
            await pool.query(sql, [portfolioid])
            console.log('Delete Portfolio Success')
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
