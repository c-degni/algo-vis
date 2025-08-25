const express = require('express');
const StackController = require('../controllers/StackController');
const QueueController = require('../controllers/QueueController');
const LinkedListController = require('../controllers/LinkedListController');

const router = express.Router();

router.post('/stack/execute', StackController.executeOperations);
router.post('/queue/execute', QueueController.executeOperations);
router.post('/linkedlist/execute', LinkedListController.executeOperations);

module.exports = router;