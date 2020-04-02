var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/api/map', function(req, res) {
    res.sendFile(path.join(__dirname, '../public', 'map.html'));
});

module.exports = router;