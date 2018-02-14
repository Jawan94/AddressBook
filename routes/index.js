var express = require('express');
var router = express.Router();
var bridge = require('../Bridge');

bridge.pingElasticServer();

// first GET route handles /contact?pageSize={}&page={}&query={}
// syntax from coding challenge readme

router.get('/contact', bridge.contactGet);

router.post('/contact', bridge.contactPost);

router.get('/contact/:name', bridge.contactNameGet);

router.put('/contact/:name', bridge.contactNamePut);

router.delete('/contact/:name', bridge.deleteContact);

module.exports = router;





//end to end tests -- make call to all of
