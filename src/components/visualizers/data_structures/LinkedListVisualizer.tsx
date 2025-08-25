import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface LinkedListVisualizerProps {
    elements: any[];
    highlights?: number[];
}

export default function LinkedListVisualizer({ elements = [], highlights = [] }: LinkedListVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const nodeWidth = Math.max(80, Math.max(...elements.map(e => {
            const textLen = String(e).length;
            return Math.min(textLen * 12 + 20, 200); // Cap at 200px max
        })));
        const nodeHeight = 60;
        const arrowLength = 40;
        const padding = 100;
        const maxWidth = 1300; // Max width per row
        const nodesPerRow = Math.floor((maxWidth - 2 * padding) / (nodeWidth + arrowLength));
        const totalRows = Math.ceil(elements.length / nodesPerRow);
        const height = Math.max(200, totalRows * (nodeHeight + 40) + 150);
        const maxRows = 2; // May add slider and remove this
        const tooManyElements = totalRows > maxRows;

        svg.attr('width', maxWidth).attr('height', height);

        if (elements.length === 0) return;

        const nodesInFirstRow = Math.min(nodesPerRow, elements.length);
        const firstRowWidth = nodesInFirstRow * (nodeWidth + arrowLength) - arrowLength;
        const startX = (maxWidth - firstRowWidth) / 2;
        const centerY = height / 2;

        if (tooManyElements) {
            svg.append('text')
                .attr('x', maxWidth / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#6B7280')
                .attr('font-size', '18')
                .attr('font-weight', 'bold')
                .text('Too many elements');
        } else {
            // Draw linked list nodes
            const nodeGroups = svg.selectAll('.node-group')
                .data(elements)
                .enter()
                .append('g')
                .attr('class', 'node-group')
                .attr('transform', (d, i) => {
                    const row = Math.floor(i / nodesPerRow);
                    const col = i % nodesPerRow;
                    const x = startX + col * (nodeWidth + arrowLength);
                    const y = centerY - nodeHeight / 2 + row * (nodeHeight + 40);
                    return `translate(${x}, ${y})`;
                });

            // Draw node rectangles
            nodeGroups.append('rect')
                .attr('width', nodeWidth)
                .attr('height', nodeHeight)
                .attr('fill', (d, i) => highlights.includes(i) ? '#3B82F6' : '#F3F4F6')
                .attr('stroke', '#374151')
                .attr('stroke-width', 2)
                .attr('rx', 5);

            // Draw node text
            nodeGroups.append('text')
                .attr('x', nodeWidth / 2)
                .attr('y', nodeHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', (d, i) => highlights.includes(i) ? 'white' : '#1F2937')
                .attr('font-size', '16')
                .attr('font-weight', 'bold')
                .text(d => d);

            // Draw arrows between nodes
            elements.forEach((element, i) => {
                if (i < elements.length - 1) {
                    const currentRow = Math.floor(i / nodesPerRow);
                    const currentCol = i % nodesPerRow;
                    const nextRow = Math.floor((i + 1) / nodesPerRow);
                    const nextCol = (i + 1) % nodesPerRow;

                    const currentX = startX + currentCol * (nodeWidth + arrowLength);
                    const currentY = centerY + currentRow * (nodeHeight + 40);
                    const nextX = startX + nextCol * (nodeWidth + arrowLength);
                    const nextY = centerY + nextRow * (nodeHeight + 40);

                    if (currentRow === nextRow) {
                        // Same row - horizontal arrow
                        const arrowStartX = currentX + nodeWidth;
                        const arrowEndX = nextX;
                        const arrowY = currentY;

                        // Arrow line
                        svg.append('line')
                            .attr('x1', arrowStartX)
                            .attr('y1', arrowY)
                            .attr('x2', arrowEndX)
                            .attr('y2', arrowY)
                            .attr('stroke', '#374151')
                            .attr('stroke-width', 2)
                            .attr('marker-end', 'url(#arrowhead)');
                    } else {
                        // Different rows
                        const arrowStartX = currentX + nodeWidth / 2;
                        const arrowStartY = currentY + nodeHeight - 30; // Bottom of current node
                        const arrowEndX = nextX + nodeWidth / 2;
                        const arrowEndY = nextY - nodeHeight / 2; // Top of next node
                        const midY = (arrowStartY + arrowEndY) / 2 - 2; // Halfway between rows

                        svg.append('path')
                            .attr('d', `M ${arrowStartX} ${arrowStartY} 
                                L ${arrowStartX} ${midY}
                                L ${arrowEndX} ${midY}
                                L ${arrowEndX} ${arrowEndY}`)
                            .attr('stroke', '#374151')
                            .attr('stroke-width', 2)
                            .attr('fill', 'none')
                            .attr('marker-end', 'url(#arrowhead)');
                    }
                }
            });

            // Define arrow marker
            const defs = svg.append('defs');
            defs.append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '0 0 10 10')
                .attr('refX', 9)
                .attr('refY', 3)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,0 L0,6 L9,3 z')
                .attr('fill', '#374151');

            // HEAD label and arrow
            if (elements.length > 0) {
                const headX = startX + nodeWidth / 2;
                svg.append('text')
                    .attr('x', headX)
                    .attr('y', centerY - nodeHeight / 2 - 25)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#DC2626')
                    .attr('font-size', '14')
                    .attr('font-weight', 'bold')
                    .text('HEAD');

                svg.append('path')
                    .attr('d', `M ${headX} ${centerY - nodeHeight / 2 - 10} 
                        L ${headX - 5} ${centerY - nodeHeight / 2 - 15} 
                        M ${headX} ${centerY - nodeHeight / 2 - 10} 
                        L ${headX + 5} ${centerY - nodeHeight / 2 - 15}`)
                    .attr('stroke', '#DC2626')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none');
            }

            // TAIL label and arrow
            if (elements.length > 0) {
                const lastIndex = elements.length - 1;
                const lastRow = Math.floor(lastIndex / nodesPerRow);
                const lastCol = lastIndex % nodesPerRow;
                const tailX = startX + lastCol * (nodeWidth + arrowLength) + nodeWidth / 2;
                const tailY = centerY + lastRow * (nodeHeight + 40);

                svg.append('text')
                    .attr('x', tailX)
                    .attr('y', tailY + nodeHeight / 2 + 35)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#059669')
                    .attr('font-size', '14')
                    .attr('font-weight', 'bold')
                    .text('TAIL');

                svg.append('path')
                    .attr('d', `M ${tailX} ${tailY + nodeHeight / 2 + 10} 
                        L ${tailX - 5} ${tailY + nodeHeight / 2 + 15} 
                        M ${tailX} ${tailY + nodeHeight / 2 + 10} 
                        L ${tailX + 5} ${tailY + nodeHeight / 2 + 15}`)
                    .attr('stroke', '#059669')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none');

                // NULL pointer for last element
                const nullX = tailX + nodeWidth / 2 + arrowLength / 2;
                svg.append('text')
                    .attr('x', nullX)
                    .attr('y', tailY)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', '#6B7280')
                    .attr('font-size', '12')
                    .attr('font-style', 'italic')
                    .text('NULL');
            }
        }

    }, [elements, highlights]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Linked List Visualization</h3>
            <div className="flex justify-center">
                <svg ref={svgRef}></svg>
            </div>
            {elements.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    <p>Linked list is empty</p>
                </div>
            )}
        </div>
    );
}