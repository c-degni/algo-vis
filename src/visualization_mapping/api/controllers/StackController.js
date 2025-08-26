const ds = require("../../../../build/Release/data_structures");

class StackController {
    static async executeOperations(req, res) {
        try {
            console.log("✅ Received request:", req.body);
            const { operations, dataType } = req.body;
    
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
                case "string":
                    stack = new ds.StringStack();
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
                    case 'push': 
                        stack.push(op.value); 
                        break;
                    case 'pop': 
                        if (stack.empty()) throw new Error('Stack underflow');
                        stack.pop(); 
                        break;
                    case 'top': 
                        if (stack.empty()) throw new Error('Stack underflow');
                        stack.top(); 
                        break;
                    case 'size': 
                        stack.size(); 
                        break;
                    case 'empty': 
                        stack.isEmpty(); 
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
            console.error("❌ StackController error:", error.message);

            if (error.message.includes('underflow')) {
                res.status(400).json({ 
                    error: error.message,
                    errorType: 'STACK_UNDERFLOW',
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

module.exports = StackController;