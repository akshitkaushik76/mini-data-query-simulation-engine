const express = require('express');
const Controller = require('../Controllers/groqController');
const router = express.Router();
router.route('/query').post(Controller.getChatResp);
router.route('/explain').post(Controller.explainQuery);
module.exports = router