import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface QueueVisualizerProps {
    elements: any[];
    highlights?: number[];
}

export default function QueueVisualizer({ elements = [], highlights = [] } : QueueVisualizerProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const elementWidth = Math.max(80, Math.max(...elements.map(e => {
            const textLen = String(e).length;
            return Math.min(textLen * 12 + 20, 200); // Cap at 200px max
        })));
        const elementHeight = 60;
        const padding = 100;
        const maxWidth = 1300; // Max width per row
        const elementsPerRow = Math.floor((maxWidth - 2 * padding) / elementWidth);
        const totalRows = Math.ceil(elements.length / elementsPerRow);
        const height = Math.max(200, totalRows * (elementHeight + 20) + 150);
        const maxRows = 2; // May add slider and remove this
        const tooManyElements = totalRows > maxRows;

        svg.attr('width', maxWidth).attr('height', height);

        if (elements.length === 0) return;

        const elemsInFirstRow = Math.min(elementsPerRow, elements.length);
        const firstRowWidth = elemsInFirstRow * elementWidth;
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
            // Draw queue elements
            const queueGroups = svg.selectAll('.queue-element')
                .data(elements)
                .enter()
                .append('g')
                .attr('class', 'queue-element')
                .attr('transform', (d, i) => {
                    const elementsPerRow = Math.floor((maxWidth - 2 * padding) / elementWidth);
                    const row = Math.floor(i / elementsPerRow);
                    const col = i % elementsPerRow;
                    const x = startX + col * elementWidth;
                    const y = centerY - elementHeight / 2 + row * (elementHeight + 20);
                    return `translate(${x}, ${y})`;
                });

            // Draw rectangles
            queueGroups.append('rect')
                .attr('width', elementWidth - 5)
                .attr('height', elementHeight)
                .attr('fill', (d, i) => highlights.includes(i) ? '#3B82F6' : '#F3F4F6')
                .attr('stroke', '#374151')
                .attr('stroke-width', 2)
                .attr('rx', 5);

            // Draw text
            queueGroups.append('text')
                .attr('x', (elementWidth - 5) / 2)
                .attr('y', elementHeight / 2)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', (d, i) => highlights.includes(i) ? 'white' : '#1F2937')
                .attr('font-size', '16')
                .attr('font-weight', 'bold')
                .text(d => d);

            // FRONT label and arrow
            const frontX = startX + (elementWidth - 5) / 2;
            svg.append('text')
                .attr('x', frontX)
                .attr('y', centerY - elementHeight / 2 - 25)
                .attr('text-anchor', 'middle')
                .attr('fill', '#DC2626')
                .attr('font-size', '14')
                .attr('font-weight', 'bold')
                .text('FRONT');

            svg.append('path')
                .attr('d', `M ${frontX} ${centerY - elementHeight / 2 - 10} 
                    L ${frontX - 5} ${centerY - elementHeight / 2 - 15} 
                    M ${frontX} ${centerY - elementHeight / 2 - 10} 
                    L ${frontX + 5} ${centerY - elementHeight / 2 - 15}`)
                .attr('stroke', '#DC2626')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

            // BACK label and arrow
            const lastIndex = elements.length - 1;
            const lastRow = Math.floor(lastIndex / elementsPerRow);
            const lastCol = lastIndex % elementsPerRow;
            const backX = startX + lastCol * elementWidth + (elementWidth - 5) / 2;
            const backY = centerY + lastRow * (elementHeight + 20);

            svg.append('text')
                .attr('x', backX)
                .attr('y', backY + elementHeight / 2 + 35)
                .attr('text-anchor', 'middle')
                .attr('fill', '#059669')
                .attr('font-size', '14')
                .attr('font-weight', 'bold')
                .text('BACK');

            svg.append('path')
                .attr('d', `M ${backX} ${backY + elementHeight / 2 + 10} 
                    L ${backX - 5} ${backY + elementHeight / 2 + 15} 
                    M ${backX} ${backY + elementHeight / 2 + 10} 
                    L ${backX + 5} ${backY + elementHeight / 2 + 15}`)
                .attr('stroke', '#059669')
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }

    }, [elements, highlights]);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Queue Visualization</h3>
            <div className="flex justify-center">
                <svg ref={svgRef}></svg>
            </div>
            {elements.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    <p>Queue is empty</p>
                </div>
            )}
        </div>
    );
}