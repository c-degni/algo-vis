const ds = require("../../../../build/Release/data_structures");

class QueueController {
    static async executeOperations(req, res) {
        try {
            console.log("✅ Received request:", req.body);
            const { operations, dataType } = req.body;
    
            let queue;
            switch (dataType.toLowerCase()) {
                case "int":
                    queue = new ds.IntQueue();
                    break;
                case "double":
                    queue = new ds.DoubleQueue();
                    break;
                case "float":
                    queue = new ds.FloatQueue();
                    break;
                case "bool":
                    queue = new ds.BoolQueue();
                    break; 
                case "string":
                    queue = new ds.StringQueue();
                    break; 
                default:
                    return res.status(400).json({ error: 'Unsupported data type' });
            }
    
            operations.forEach((op, index) => {
                console.log(`Operation ${index}:`, {
                    type: op.type,
                    value: op.value,
                    valueType: typeof op.value,
                    isNumber: typeof op.value === 'number',
                    isInteger: Number.isInteger(op.value)
                });

                switch (op.type) {
                    case 'enqueue': 
                        queue.enqueue(op.value); 
                        break;
                    case 'dequeue': 
                        if (queue.empty()) throw new Error('Queue underflow');
                        queue.dequeue(); 
                        break;
                    case 'front': 
                        if (queue.empty()) throw new Error('Queue underflow');
                        queue.front(); 
                        break;
                    case 'size': 
                        queue.size(); 
                        break;
                    case 'empty': 
                        queue.isEmpty(); 
                        break;
                    case 'clear': 
                        queue.clear(); 
                        break;
                }
            });
            
            const trace = JSON.parse(queue.getTrace());
            console.log("✅ Generated trace with", trace.length, "steps");
    
            res.json({ 
                trace, 
                dataStructure: "queue",
                dataType 
            });
            
        } catch (error) {
            console.error("❌ QueueController error:", error.message);

            if (error.message.includes('underflow')) {
                res.status(400).json({ 
                    error: error.message,
                    errorType: 'QUEUE_UNDERFLOW',
                });
            } else {
                res.status(500).json({ 
                    error: error.message,
                    errorType: 'GENERAL_ERROR',
                });
            }
        }
    }
}

module.exports = QueueController;