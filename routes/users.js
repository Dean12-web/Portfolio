var express = require('express');
var router = express.Router();
var path = require('path');
const moment = require('moment')

/* GET users listing. */
module.exports = (pool) => {
  router.get('/', async function (req, res, next) {
    try {
      res.render('admin/users/profile', { title: 'Profile', user: req.session.user, moment, info: req.flash('info') })
    } catch (error) {
      res.json(error)
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const { userid } = req.session.user
      const { username, email, dateofbirth, address, phone } = req.body
      const sampleFile = req.files.avatar;
      console.log(sampleFile)
      const fileName = `${Date.now()}-${sampleFile.name}`;
      const uploadPath = path.join(__dirname, '..', 'public', 'images', fileName);
      sampleFile.mv(uploadPath, function(err){
        if(err){
          console.log(err)
          return res.status(500).send(err)
        }
      })
      let query = `UPDATE users SET username = $1, email = $2, dateofbirth =$3, address = $4, phone = $5, avatar = $6 WHERE userid = $7`
      await pool.query(query, [username, email, dateofbirth, address, phone,fileName, userid])
      const { rows: datas } = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
      const data = datas[0]
      req.session.user = data
      req.session.save()
      req.flash('info', "Your Profile Has Been Updated")
      console.log('Update Profile Success')
      res.redirect('/users')
    } catch (error) {
      console.log(error)
    }
  })


  return router
}
