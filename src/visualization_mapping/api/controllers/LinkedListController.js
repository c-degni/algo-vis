const ds = require("../../../../build/Release/data_structures");

class LinkedListController {
    static async executeOperations(req, res) {
        try {
            console.log("✅ Received request:", req.body);
            const { operations, dataType } = req.body;
    
            let ll;
            switch (dataType.toLowerCase()) {
                case "int":
                    ll = new ds.IntLinkedList();
                    break;
                case "double":
                    ll = new ds.DoubleLinkedList();
                    break;
                case "float":
                    ll = new ds.FloatLinkedList();
                    break;
                case "bool":
                    ll = new ds.BoolLinkedList();
                    break; 
                case "string":
                    ll = new ds.StringLinkedList();
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
                    case 'insert': 
                        ll.insert(op.value); 
                        break;
                    case 'remove':
                        if (!ll.inList(op.value)) throw new Error('Not found');
                        ll.remove(op.value); 
                        break;
                    case 'find': 
                        if (!ll.inList(op.value)) throw new Error('Not found');
                        ll.find(op.value); 
                        break;
                    case 'size': 
                        ll.size(); 
                        break;
                }
            });
            
            const trace = JSON.parse(ll.getTrace());
            console.log("✅ Generated trace with", trace.length, "steps");
    
            res.json({ 
                trace, 
                dataStructure: "linkedlist",
                dataType 
            });
            
        } catch (error) {
            console.error("❌ LinkedListController error:", error.message);
            if (error.message.includes('found')) {
                res.status(400).json({ 
                    error: error.message,
                    errorType: 'NOT_FOUND',
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

module.exports = LinkedListController;