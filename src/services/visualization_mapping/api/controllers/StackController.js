const ds = require("../../../../../build/Release/data_structures");

class StackController {
    static async executeOperations(req, res) {
        try {
            console.log("✅ Received request:", req.body);
            const { operations, dataType = "int" } = req.body;
    
            let stack;
            switch (dataType.toLowerCase()) {
                case "int":
                    stack = new ds.IntStack();
                    break;
                case "double":
                    stack = new ds.DoubleStack();
                    break;
                case "float":
                    stack = new ds.FloatStack();
                    break;
                case "bool":
                    stack = new ds.BoolStack();
                    break; 
                default:
                    return res.status(400).json({ error: 'Unsupported data type' });
            }
    
            operations.forEach((op, index) => {
                console.log(`Processing operation ${index}:`, op);
                switch (op.type) {
                    case 'push': 
                        stack.push(parseInt(op.val, 10)); 
                        break;
                    case 'pop': 
                        stack.pop(); 
                        break;
                    case 'top': 
                        stack.top(); 
                        break;
                    case 'size': 
                        stack.size(); 
                        break;
                    case 'empty': 
                        stack.isEmpty(); 
                        break;
                    case 'clear': 
                        stack.clear(); 
                        break;
                }
            });

            
            const trace = JSON.parse(stack.getTrace());
            console.log("✅ Generated trace with", trace.length, "steps");
    
            res.json({ 
                trace, 
                dataStructure: "stack",
                dataType 
            });
            
        } catch (error) {
            console.error("❌ StackController error:", error);
            res.status(500).json({ 
                error: error.message,
                stack: error.stack 
            });
        }
    }
}

module.exports = StackController;