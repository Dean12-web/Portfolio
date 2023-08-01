var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')


/* GET home page. */
module.exports = (pool) => {
  router.get('/', async function (req, res, next) {
    try {
      res.render('client/index', {user:req.session.username})
    } catch (error) {
      res.json(error)
    }
  });

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


