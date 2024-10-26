var express = require('express');
var router = express.Router();
const myController = require('../controller/Controllers')
// Routes

router.get('/hoooommme.html', myController.user_index_get);
router.get('/', myController.user_login_get);
router.get('/datahouse', myController.user_house_get);
router.get('/dataUser', myController.user_data_get);
router.get('/dataRealty', myController.realty_data_get);
// router.get('/search', myController.user_search_get);
router.delete('/house/:id-delete', myController.house_edit_delete);
router.delete('/realty/:id-delete', myController.realty_edit_delete);
router.delete('/edit/:id', myController.user_edit_delete);
router.put('/update/:id', myController.user_edit_put);
router.get('/user/:id-edit', myController.user_edit_get);
router.get('/house/:id-edit', myController.house_edit_get);
router.get('/house/:id-eimgs', myController.houseimgs_edit_get);
router.get('/realty/:id-eimgs', myController.realtyimgs_edit_get);
router.get('/user/:id', myController.user_view_get);
  

module.exports = router;

