const Router = require('express').Router; //Memanggil fungsi route dari framework ExpressJS
const router = Router(); //Deklarasi route

const { 

index,
indexPOST,
read,
downloadChapter

 } = require('../controllers/app.controller'); //Memanggil Array dari app.controller.js

//route awal
router.get('/', index);
router.post('/', indexPOST);
router.get('/read/:uri', read);
router.post('/downloadchapter/:uri', downloadChapter);

module.exports = router; //Mengimport module router dengan fungsi module.exports