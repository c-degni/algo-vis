const ds = require("../../../../build/Release/data_structures");

class BinaryTreeController {
    static async executeOperations(req, res) {
        try {
            console.log("✅ Received request:", req.body);
            const { operations, dataType } = req.body;
    
            let bt;
            switch (dataType.toLowerCase()) {
                case "int":
                    bt = new ds.IntBinaryTree();
                    break;
                case "double":
                    bt = new ds.DoubleBinaryTree();
                    break;
                case "float":
                    bt = new ds.FloatBinaryTree();
                    break;
                case "bool":
                    bt = new ds.BoolBinaryTree();
                    break; 
                case "string":
                    bt = new ds.StringBinaryTree();
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
                        bt.insert(op.value); 
                        break;
                    case 'remove':
                        if (!bt.inTree(op.value)) throw new Error('Not found');
                        bt.remove(op.value); 
                        break;
                    case 'find': 
                        if (!bt.inTree(op.value)) throw new Error('Not found');
                        bt.find(op.value); 
                        break;
                    case 'size': 
                        bt.size(); 
                        break;
                    case 'getHeight': 
                        bt.getHeight(); 
                        break;
                    case 'inorder': 
                        bt.inorder(); 
                        break;
                    case 'preorder': 
                        bt.preorder(); 
                        break;
                    case 'postorder': 
                        bt.postorder(); 
                        break;
                }
            });
            
            const trace = JSON.parse(bt.getTrace());
            console.log("✅ Generated trace with", trace.length, "steps");
    
            res.json({ 
                trace, 
                dataStructure: "binarytree",
                dataType 
            });
            
        } catch (error) {
            console.error("❌ BinaryTreeController error:", error.message);
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

module.exports = BinaryTreeController;