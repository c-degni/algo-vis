// const ds = require("../../../../../build/Release/data_structures");

// class StackController {
//     static async executeOperations(req, res) {
//         try {
//             const { operations, dataType = "int" } = req.body;
    
//             let stack;
//             switch (dataType.toLowerCase()) {
//                 case "int":
//                     stack = new ds.IntStack();
//                     break;
//                 case "double":
//                     stack = new ds.DoubleStack();
//                     break;
//                 case "float":
//                     stack = new ds.FloatStack();
//                     break;
//                 case "bool":
//                     stack = new ds.BoolStack();
//                     break; 
//                 default:
//                     return res.status(400).json({ error: 'Unsupported data type' });
//             }
    
//             operations.forEach(op => {
//                 switch (op.type) {
//                     case 'push': 
//                         stack.push(op.val); 
//                         break;
//                     case 'pop': 
//                         stack.pop(); 
//                         break;
//                     case 'top': 
//                         stack.top(); 
//                         break;
//                     case 'size': 
//                         stack.size(); 
//                         break;
//                     case 'empty': 
//                         stack.isEmpty(); 
//                         break;
//                     case 'clear': 
//                         stack.clear(); 
//                         break;
//                 }
//             });
    
//             const trace = JSON.parse(stack.getTrace());
    
//             res.json({ 
//                 trace, 
//                 dataStructure: "stack",
//                 dataType 
//             });
            
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// }

// module.exports = StackController;
// Comment out the problematic C++ require:
// const ds = require("../../../../../build/Release/data_structures");

class StackController {
    static async executeOperations(req, res) {
        try {
            console.log("✅ Received request:", req.body);
            
            const { operations, dataType = "int" } = req.body;
    
            // MOCK IMPLEMENTATION for testing
            const mockTrace = [];
            let mockStack = [];
            
            operations.forEach((op, index) => {
                console.log(`Processing operation ${index}:`, op);
                
                switch (op.type) {
                    case 'push':
                        mockStack.push(op.value);
                        mockTrace.push({
                            operation: 'push',
                            description: `Pushed ${op.value} to stack`,
                            state: { elements: [...mockStack], size: mockStack.length },
                            highlights: [mockStack.length - 1],
                            timestamp: Date.now() + index * 100
                        });
                        break;
                    case 'pop':
                        if (mockStack.length > 0) {
                            const popped = mockStack.pop();
                            mockTrace.push({
                                operation: 'pop',
                                description: `Popped ${popped} from stack`,
                                state: { elements: [...mockStack], size: mockStack.length },
                                highlights: [],
                                timestamp: Date.now() + index * 100
                            });
                        }
                        break;
                    case 'top':
                        mockTrace.push({
                            operation: 'top',
                            description: `Top element: ${mockStack[mockStack.length - 1] || 'empty'}`,
                            state: { elements: [...mockStack], size: mockStack.length },
                            highlights: mockStack.length > 0 ? [mockStack.length - 1] : [],
                            timestamp: Date.now() + index * 100
                        });
                        break;
                }
            });
    
            console.log("✅ Generated trace with", mockTrace.length, "steps");
    
            res.json({ 
                trace: mockTrace, 
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