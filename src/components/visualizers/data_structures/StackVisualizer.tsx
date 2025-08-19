import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StackVisualizerProps {
  elements: any[];
  highlights?: number[];
}

export default function StackVisualizer({ elements = [], highlights = [] } : StackVisualizerProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 400;
    const height = Math.max(300, elements.length * 60 + 100);
    const elementHeight = 50;
    const elementWidth = 200;

    svg.attr('width', width).attr('height', height);

    // Draw stack elements
    const stackGroups = svg.selectAll('.stack-element')
      .data(elements)
      .enter()
      .append('g')
      .attr('class', 'stack-element')
      .attr('transform', (d, i) => 
        `translate(${(width - elementWidth) / 2}, ${height - 80 - (i + 1) * elementHeight})`
      );

    // Draw rectangles
    stackGroups.append('rect')
      .attr('width', elementWidth)
      .attr('height', elementHeight - 5)
      .attr('fill', (d, i) => highlights.includes(i) ? '#3B82F6' : '#E5E7EB')
      .attr('stroke', '#374151')
      .attr('stroke-width', 2)
      .attr('rx', 5);

    // Draw text
    stackGroups.append('text')
      .attr('x', elementWidth / 2)
      .attr('y', elementHeight / 2 - 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d, i) => highlights.includes(i) ? 'white' : '#1F2937')
      .attr('font-size', '18')
      .attr('font-weight', 'bold')
      .text(d => d);

    // Add "TOP" label
    if (elements.length > 0) {
      svg.append('text')
        .attr('x', (width + elementWidth) / 2 + 20)
        .attr('y', height - 80 - elements.length * elementHeight + elementHeight / 2)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#7C3AED')
        .attr('font-size', '14')
        .attr('font-weight', 'bold')
        .text('← TOP');
    }

  }, [elements, highlights]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Stack Visualization</h3>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
      {elements.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>Stack is empty</p>
        </div>
      )}
    </div>
  );
}