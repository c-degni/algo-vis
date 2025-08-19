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

        const elementWidth = 80;
        const elementHeight = 60;
        const width = Math.max(400, elements.length * elementWidth + 200);
        const height = 200;

        svg.attr('width', width).attr('height', height);

        // Draw queue elements
        const queueGroups = svg.selectAll('.queue-element')
            .data(elements)
            .enter()
            .append('g')
            .attr('class', 'queue-element')
            .attr('transform', (d, i) => 
                `translate(${100 + i * elementWidth}, ${(height - elementHeight) / 2})`
            );

        // Draw rectangles
        queueGroups.append('rect')
            .attr('width', elementWidth - 5)
            .attr('height', elementHeight)
            .attr('fill', (d, i) => highlights.includes(i) ? '#3B82F6' : '#E5E7EB')
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

        // Add "FRONT" label
        if (elements.length > 0) {
            svg.append('text')
                .attr('x', 100 + (elementWidth - 5) / 2)
                .attr('y', (height - elementHeight) / 2 - 15)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#DC2626')
                .attr('font-size', '12')
                .attr('font-weight', 'bold')
                .text('FRONT');

            // Add arrow pointing to front
            svg.append('path')
                .attr('d', `M ${100 + (elementWidth - 5) / 2} ${(height - elementHeight) / 2 - 5} 
                    L ${100 + (elementWidth - 5) / 2 - 5} ${(height - elementHeight) / 2 - 10} 
                    M ${100 + (elementWidth - 5) / 2} ${(height - elementHeight) / 2 - 5} 
                    L ${100 + (elementWidth - 5) / 2 + 5} ${(height - elementHeight) / 2 - 10}`)
                .attr('stroke', '#DC2626')
                .attr('stroke-width', 2)
                .attr('fill', 'none');
        }

        // Add "BACK" label
        if (elements.length > 0) {
            svg.append('text')
                .attr('x', 100 + (elements.length - 1) * elementWidth + (elementWidth - 5) / 2)
                .attr('y', (height + elementHeight) / 2 + 25)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('fill', '#059669')
                .attr('font-size', '12')
                .attr('font-weight', 'bold')
                .text('BACK');

            // Add arrow pointing to back
            svg.append('path')
                .attr('d', `M ${100 + (elements.length - 1) * elementWidth + (elementWidth - 5) / 2} ${(height + elementHeight) / 2 + 15} 
                        L ${100 + (elements.length - 1) * elementWidth + (elementWidth - 5) / 2 - 5} ${(height + elementHeight) / 2 + 20} 
                        M ${100 + (elements.length - 1) * elementWidth + (elementWidth - 5) / 2} ${(height + elementHeight) / 2 + 15} 
                        L ${100 + (elements.length - 1) * elementWidth + (elementWidth - 5) / 2 + 5} ${(height + elementHeight) / 2 + 20}`)
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
            {/* {elements.length > 0 && (
                <div className="mt-4 text-sm text-gray-600 text-center">
                    <p><span className="text-red-600 font-semibold">FRONT</span> - Elements are removed from here (dequeue)</p>
                    <p><span className="text-green-600 font-semibold">REAR</span> - Elements are added here (enqueue)</p>
                </div>
            )} */}
        </div>
    );
}