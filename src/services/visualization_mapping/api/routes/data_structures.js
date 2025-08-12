const express = require('express');
const StackController = require('../controllers/StackController');
// Queue next

const router = express.Router();

router.post('/stack/execute', StackController.executeOperations);
// Queue next

module.exports = router;