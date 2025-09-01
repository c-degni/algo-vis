import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StackPage from './components/pages/StackPage';
import QueuePage from './components/pages/QueuePage';
import LinkedListPage from './components/pages/LinkedListPage';
import BinaryTreePage from './components/pages/BinaryTreePage';

export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                {/* Navigation */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <Link to="/" className="text-xl font-bold text-gray-800">
                                    Algo-Vis
                                </Link>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/stack" 
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Stack
                                </Link>
                                <Link 
                                    to="/queue" 
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Queue
                                </Link>
                                <Link 
                                    to="/linkedlist" 
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Linked List
                                </Link>
                                <Link 
                                    to="/binarytree" 
                                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Binary Tree
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto py-6 px-4">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/stack" element={<StackPage />} />
                        <Route path="/queue" element={<QueuePage />} />
                        <Route path="/linkedlist" element={<LinkedListPage />} />
                        <Route path="/binarytree" element={<BinaryTreePage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

// Simple home page
function HomePage() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
                Interactive Data Structure + Algorithm Visualizer
            </h1>
            <p className="text-xl text-gray-600 mb-8">
                Learn data structures and algorithms through interactive visualizations
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <Link 
                    to="/stack"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Stack</h3>
                    <p className="text-gray-600">LIFO (Last In, First Out) data structure</p>
                </Link>
                <Link 
                    to="/queue"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Queue</h3>
                    <p className="text-gray-600">FIFO (First In, First Out) data structure</p>
                </Link>
                <Link 
                    to="/linkedlist"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Linked List</h3>
                    <p className="text-gray-600">Linear data structure</p>
                </Link>
                <Link 
                    to="/binarytree"
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Binary tree</h3>
                    <p className="text-gray-600">Classic binary tree</p>
                </Link>
            </div>
        </div>
    );
}