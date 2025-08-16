const express = require('express');
const dataStructureRoutes = require('./data_structures');
// const algorithmRoutes = require('./algorithms'); // Add when you create algorithms

const router = express.Router();

router.use('/data-structures', dataStructureRoutes);
// router.use('/algorithms', algorithmRoutes);

// API catalog - shows all available visualizations
router.get('/catalog', (req, res) => {
    res.json({
        status: 'success',
        data: {
            dataStructures: {
                available: ['stack'], // Adding 'queue' next
                categories: {
                    linear: ['stack'], // Adding 'queue', 'linkedlist' 
                    trees: [], // Will have 'binarytree', 'bst', 'avl', 'heap'
                    graphs: [], // Will have 'graph', 'adjacencymatrix'
                    hash: [] // Will have 'hashtable'
                }
            },
            // algorithms: {
            //     available: [], // Will have sorting, searching, graph algorithms
            //     categories: {
            //         sorting: [], // Will have 'bubblesort', 'quicksort', 'mergesort'
            //         searching: [], // Will have 'binarysearch', 'linearsearch'
            //         graph: [] // Will have 'dijkstra', 'bfs', 'dfs'
            //     }
            // },
            version: '1.0.0'
        }
    });
});

// Health check
router.get('/health', (req, res) => {
    res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
        api: {
            dataStructures: true,
            algorithms: false // will be true when done
        }
    });
});

// API info
router.get('/', (req, res) => {
    res.json({
        message: 'Data Structure & Algorithm Visualizer API',
        version: '1.0.0',
        endpoints: {
            catalog: '/api/catalog',
            health: '/api/health',
            dataStructures: '/api/data-structures',
            algorithms: '/api/algorithms'
        },
        // documentation: 'https://github.com/algo-vis/docs' // Docs aren't made yet lol (will never be)
    });
});

module.exports = router;