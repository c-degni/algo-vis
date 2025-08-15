const ds = require("../../../../../build/Release/data_structures");

class StackController {
    static async executeOperations(req, res) {
        try {
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
    
            operations.forEach(op => {
                switch (op.type) {
                    case 'push': 
                        stack.push(op.val); 
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
    
            res.json({ 
                trace, 
                dataStructure: "stack",
                dataType 
            });
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = StackController;