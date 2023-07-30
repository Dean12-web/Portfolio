var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
  } catch (error) {
    res.json(error)
  }
});

router.get('/:id/avatar', async function (req, res, next) {
  try {
    const { id } = req.params
    const user = await models.User.findAll({
      where: {
        id }
        ,
        returning: true,
        plain: true
    })
    res.json(user)
  } catch (error) {
    res.json(error)
  }
})
router.put('/:id/avatar', async function (req, res, next) {
  try {
  } catch (error) {
    console.log(error)

  }
})
router.post('/', async function (req, res, next) {
  try {
  } catch (error) {
    res.json(error)
  }
});
router.delete

module.exports = router;
