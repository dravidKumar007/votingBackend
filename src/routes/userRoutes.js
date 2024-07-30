const express= require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

const {signin,login}= require('../controller/userController');

app.use(bodyParser.json());



router.post('/signin',signin );
router.get('/login',login);


module.exports =router;