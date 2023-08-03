var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var moment = require('moment')


/* GET home page. */
module.exports = (pool) => {
  router.get('/', async function (req, res, next) {
    try {
      let sql = `SELECT * FROM users`
      let data = await pool.query(sql)
      let porto = await pool.query(`SELECT * FROM portfolios`)
      let total = await pool.query(`SELECT COUNT(*) as total FROM portfolios`)
      let getAge = `SELECT EXTRACT(YEAR FROM AGE(NOW()::date, dateofbirth)) AS age FROM users`
      let age = await pool.query(getAge)
      console.log(total.rows[0])
      res.render('client/index', {data:data.rows[0], moment, age:age.rows[0], porto: porto.rows, total:total.rows[0]})
    } catch (error) {
      res.json(error)
    }
  });

  router.get('/detail/:portfolioid',async function(req,res,next){
    try {
      const {portfolioid} = req.params
      const porto = await pool.query(`SELECT * FROM portfolios WHERE portfolioid = $1`,[portfolioid])
      const data = await pool.query(`SELECT * FROM users`)
      res.render('client/portfolio/index', {data:data.rows[0], porto:porto.rows[0]})
    } catch (error) {
      console.log(error)
    }
  })

  router.get('/login', function (req, res, next) {
    res.render('login', { title: "Log in", info: req.flash('info') });
  });


  router.post('/login', async function (req, res, next) {
    try {
      const { email, password } = req.body
      const sql = `SELECT * FROM users WHERE email = $1`
      const { rows } = await pool.query(sql,[email])
      if(rows.length === 0){
        req.flash('info', "User Doesn't Exist")
        return res.redirect('/login')
      }
      if(!bcrypt.compareSync(password, rows[0].password)){
        req.flash('info', "Wrong Password")
        return res.redirect('/login')
      }
      req.session.user = rows[0]
      res.redirect('/admin')
    } catch (error) {
      console.log(error)
    }
  })

  router.get('/logout', (req,res,next)=>{
    req.session.destroy((err)=>{
      res.redirect('/login')
    })
  })
  return router
}


