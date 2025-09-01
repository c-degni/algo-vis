
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
    value: any;
    left?: TreeNode;
    right?: TreeNode;
}

interface BinaryTreeVisualizerProps {
    root?: TreeNode | null;
    inorder?: any[];
    preorder?: any[];
    highlights?: any[];
}

export default function BinaryTreeVisualizer({ 
    root = null, 
    inorder = [],
    preorder = [],
    highlights = [] 
}: BinaryTreeVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    const reconstructTree = (inorder: any[], preorder: any[]): TreeNode | null => {
        if (!inorder.length || !preorder.length) return null;
        
        const rootValue = preorder[0];
        const rootIndex = inorder.indexOf(rootValue);
        
        const leftInorder = inorder.slice(0, rootIndex);
        const leftPreorder = preorder.slice(1, 1 + leftInorder.length);
        const rightInorder = inorder.slice(rootIndex + 1);
        const rightPreorder = preorder.slice(1 + leftInorder.length);
        
        return {
            value: rootValue,
            left: reconstructTree(leftInorder, leftPreorder),
            right: reconstructTree(rightInorder, rightPreorder)
        };
    };

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const tree = root || (inorder.length && preorder.length ? reconstructTree(inorder, preorder) : null);
    
        if (!tree) return;

        const nodeRadius = 25;
        const levelHeight = 80;
        const minNodeSpacing = 60;
        const padding = 50;

        // Calculate tree dimensions
        const getTreeDepth = (node: TreeNode | null): number => {
            if (!node) return 0;
            return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
        };

        const getTreeWidth = (node: TreeNode | null, depth: number): number => {
            if (!node || depth === 0) return 0;
            if (depth === 1) return 1;
            return getTreeWidth(node.left, depth - 1) + getTreeWidth(node.right, depth - 1);
        };

        const depth = getTreeDepth(tree);
        const maxWidth = Math.pow(2, depth - 1) * minNodeSpacing;
        const totalWidth = Math.max(600, maxWidth + 2 * padding);
        const totalHeight = Math.max(300, depth * levelHeight + 2 * padding);

        const maxDepth = 5; // Limit depth for readability
        const tooManyLevels = depth > maxDepth;

        svg.attr('width', totalWidth).attr('height', totalHeight);

        if (tooManyLevels) {
            svg.append('text')
                .attr('x', totalWidth / 2)
                .attr('y', totalHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#6B7280')
                .attr('font-size', '18')
                .attr('font-weight', 'bold')
                .text('Tree too deep to display');
            return;
        }

        // Position nodes using a recursive approach
        const positionNodes = (node: TreeNode | null, x: number, y: number, level: number): any[] => {
            if (!node) return [];

            const positions = [{ node, x, y, level }];
            
            if (level < depth) {
                const spacing = maxWidth / Math.pow(2, level + 1);
                
                if (node.left) {
                    positions.push(...positionNodes(node.left, x - spacing, y + levelHeight, level + 1));
                }
                if (node.right) {
                    positions.push(...positionNodes(node.right, x + spacing, y + levelHeight, level + 1));
                }
            }

            return positions;
        };

        const nodePositions = positionNodes(tree, totalWidth / 2, padding + nodeRadius, 0);

        // Draw connections first (so they appear behind nodes)
        nodePositions.forEach(({ node, x, y }) => {
            if (node.left) {
                const leftChild = nodePositions.find(pos => pos.node === node.left);
                if (leftChild) {
                    svg.append('line')
                        .attr('x1', x)
                        .attr('y1', y)
                        .attr('x2', leftChild.x)
                        .attr('y2', leftChild.y)
                        .attr('stroke', '#374151')
                        .attr('stroke-width', 2);
                }
            }

            if (node.right) {
                const rightChild = nodePositions.find(pos => pos.node === node.right);
                if (rightChild) {
                    svg.append('line')
                        .attr('x1', x)
                        .attr('y1', y)
                        .attr('x2', rightChild.x)
                        .attr('y2', rightChild.y)
                        .attr('stroke', '#374151')
                        .attr('stroke-width', 2);
                }
            }
        });

        // Draw nodes
        const nodeGroups = svg.selectAll('.tree-node')
            .data(nodePositions)
            .enter()
            .append('g')
            .attr('class', 'tree-node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        // Draw circles
        nodeGroups.append('circle')
            .attr('r', nodeRadius)
            .attr('fill', d => highlights.includes(d.node.value) ? '#3B82F6' : '#F3F4F6')
            .attr('stroke', '#374151')
            .attr('stroke-width', 2);

        // Draw text
        nodeGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', d => highlights.includes(d.node.value) ? 'white' : '#1F2937')
            .attr('font-size', '14')
            .attr('font-weight', 'bold')
            .text(d => d.node.value);

        // Add ROOT label
        if (nodePositions.length > 0) {
            const rootPos = nodePositions[0];
            svg.append('text')
                .attr('x', rootPos.x)
                .attr('y', rootPos.y - nodeRadius - 15)
                .attr('text-anchor', 'middle')
                .attr('fill', '#DC2626')
                .attr('font-size', '12')
                .attr('font-weight', 'bold')
                .text('ROOT');
        }

    }, [root, inorder, preorder, highlights]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Binary Tree Visualization</h3>
            <div className="flex justify-center">
                <svg ref={svgRef}></svg>
            </div>
            {!root && inorder.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    <p>Tree is empty</p>
                </div>
            )}
        </div>
    );
}