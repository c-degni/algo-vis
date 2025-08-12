const express = require('express');
const CppStack = require('../build/Release/cpp_stack');
const router = express.Router();

router.post('/stack-test', (req, res) => {
  try {
    const stack = new CppStack.TrackedStack();
    const { operations } = req.body;
    
    operations.forEach(op => {
      switch(op.type) {
        case 'push':
          stack.push(op.value);
          break;
        case 'pop':
          stack.pop();
          break;
      }
    });
    
    const trace = stack.getTrace();
    res.json({ trace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;