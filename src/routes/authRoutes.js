const express= require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

const {genarateKey}=require('../controller/authController');

app.use(bodyParser.json());



router.get('/token',genarateKey);

module.exports =router;