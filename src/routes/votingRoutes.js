const express= require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

const {verifyToken}=require('../controller/authController');
const {castVote,getVoter}=require('../controller/votingController');

app.use(bodyParser.json());

router.post('/castvote',verifyToken,castVote);
router.get('/getVoter',verifyToken,getVoter);




module.exports =router;