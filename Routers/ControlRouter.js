const express = require('express');
const Controller = require('../Controllers/groqController');
const authController = require('../Controllers/authenticatecontroller');
const router = express.Router();
router.route('/query').post(authController.protect,Controller.getChatResp);
router.route('/explain').post(authController.protect,Controller.explainQuery);
router.route('/validate').post(authController.protect,Controller.validatepsuedoSQL);
module.exports = router