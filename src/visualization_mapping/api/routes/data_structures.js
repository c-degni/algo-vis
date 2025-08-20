const express = require('express');
const StackController = require('../controllers/StackController');
const QueueController = require('../controllers/QueueController');

const router = express.Router();

router.post('/stack/execute', StackController.executeOperations);
router.post('/queue/execute', QueueController.executeOperations);

module.exports = router;