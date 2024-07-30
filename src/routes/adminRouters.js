const express= require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

const {verifyToken}=require('../controller/authController');
const {addParty,deleteParty,getParty}=require('../controller/adminController');
app.use(bodyParser.json());



router.post('/addparty',verifyToken,addParty);
router.delete('/deleteparty',verifyToken,deleteParty);
router.get('/getparty',verifyToken,getParty);

module.exports =router;