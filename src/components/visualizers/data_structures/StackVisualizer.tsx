// import React, { useRef, useEffect } from "react";
// import * as d3 from "d3";

// interface StackElement {
//   value: number;
//   index: number;
//   highlighted?: boolean;
// }

// interface StackVisualizerProps {
//   elements: StackElement[];
//   operation?: string;
//   description?: string;
// }

// export const StackVisualizer: React.FC<StackVisualizerProps> = ({ 
//   elements, 
//   operation, 
//   description 
// }) => {
//   const svgRef = useRef<SVGSVGElement>(null);
  
//   useEffect(() => {
//     if (!svgRef.current) return;
    
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove();
    
//     const width = 300;
//     const height = 400;
//     const elementHeight = 40;
//     const elementWidth = 100;
    
//     const container = svg
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${width / 2 - elementWidth / 2}, 20)`);
    
//     // Draw stack from bottom to top (align with structure)
//     const stackElements = container
//       .selectAll(".stack-element")
//       .data(elements.slice().reverse(), (d: any) => d.index);
    
//     // New elements
//     const enterElements = stackElements
//       .enter()
//       .append("g")
//       .attr("class", "stack-element")
//       .attr("transform", (d, i) => `translate(0, ${height - 60 - (i + 1) * elementHeight})`);
    
//     // Rects
//     enterElements
//       .append("rect")
//       .attr("width", elementWidth)
//       .attr("height", elementHeight - 2)
//       .attr("fill", d => d.highlighted ? "#ff6b6b" : "#4ecdc4")
//       .attr("stroke", "#2c3e50")
//       .attr("stroke-width", 2)
//       .attr("rx", 4);
    
//     // Text
//     enterElements
//       .append("text")
//       .attr("x", elementWidth / 2)
//       .attr("y", elementHeight / 2)
//       .attr("text-anchor", "middle")
//       .attr("dominant-baseline", "middle")
//       .attr("fill", "white")
//       .attr("font-weight", "bold")
//       .text(d => d.value);
    
//     // Update existing elems
//     stackElements
//       .transition()
//       .duration(500)
//       .attr("transform", (d, i) => `translate(0, ${height - 60 - (i + 1) * elementHeight})`)
//       .select("rect")
//       .attr("fill", d => d.highlighted ? "#ff6b6b" : "#4ecdc4");
    
//     // Remove exiting elems
//     stackElements
//       .exit()
//       .transition()
//       .duration(300)
//       .style("opacity", 0)
//       .remove();
    
//     // Add stack pointer to indicate top
//     if (elements.length > 0) {
//       container
//         .append("polygon")
//         .attr(
//           "points", 
//           `${elementWidth + 10}, 
//             ${height - 60 - elements.length * elementHeight + elementHeight / 2 - 5} ${elementWidth + 20}, ${height - 60 - elements.length * elementHeight + elementHeight / 2} ${elementWidth + 10}, ${height - 60 - elements.length * elementHeight + elementHeight / 2 + 5}`)
//         .attr("fill", "#e74c3c");
        
//       container
//         .append("text")
//         .attr("x", elementWidth + 25)
//         .attr("y", height - 60 - elements.length * elementHeight + elementHeight / 2)
//         .attr("dominant-baseline", "middle")
//         .attr("fill", "#e74c3c")
//         .attr("font-weight", "bold")
//         .text("TOP");
//     }
    
//   }, [elements, operation]);
  
//   return (
//     <div className="flex flex-col items-center">
//       <svg ref={svgRef}></svg>
//       {operation && (
//         <div className="mt-4 p-2 bg-blue-100 rounded">
//           <strong>Operation:</strong> {operation}
//           <br />
//           <strong>Description:</strong> {description}
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface StackVisualizerProps {
  elements: any[];
  highlights?: number[];
}

export default function StackVisualizer({ elements = [], highlights = [] }: StackVisualizerProps) {
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