const express = require('express');
const router = express.Router();
const line = require('@line/bot-sdk');
const { config, handleMessageEvent } = require('../controllers/linebot_controller.js');

//! 建立 webhook 路由
router.post('/webhook', line.middleware(config), (req, res) => {
    Promise.all(req.body.events.map(handleMessageEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.log(err);
            res.status(500).end();
        });
});

module.exports = router;
