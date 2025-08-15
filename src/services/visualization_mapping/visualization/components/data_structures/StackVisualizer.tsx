import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface StackElement {
  value: number;
  index: number;
  highlighted?: boolean;
}

interface StackVisualizerProps {
  elements: StackElement[];
  operation?: string;
  description?: string;
}

export const StackVisualizer: React.FC<StackVisualizerProps> = ({ 
  elements, 
  operation, 
  description 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    const width = 300;
    const height = 400;
    const elementHeight = 40;
    const elementWidth = 100;
    
    const container = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2 - elementWidth / 2}, 20)`);
    
    // Draw stack from bottom to top (align with structure)
    const stackElements = container
      .selectAll(".stack-element")
      .data(elements.slice().reverse(), (d: any) => d.index);
    
    // New elements
    const enterElements = stackElements
      .enter()
      .append("g")
      .attr("class", "stack-element")
      .attr("transform", (d, i) => `translate(0, ${height - 60 - (i + 1) * elementHeight})`);
    
    // Rects
    enterElements
      .append("rect")
      .attr("width", elementWidth)
      .attr("height", elementHeight - 2)
      .attr("fill", d => d.highlighted ? "#ff6b6b" : "#4ecdc4")
      .attr("stroke", "#2c3e50")
      .attr("stroke-width", 2)
      .attr("rx", 4);
    
    // Text
    enterElements
      .append("text")
      .attr("x", elementWidth / 2)
      .attr("y", elementHeight / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .text(d => d.value);
    
    // Update existing elems
    stackElements
      .transition()
      .duration(500)
      .attr("transform", (d, i) => `translate(0, ${height - 60 - (i + 1) * elementHeight})`)
      .select("rect")
      .attr("fill", d => d.highlighted ? "#ff6b6b" : "#4ecdc4");
    
    // Remove exiting elems
    stackElements
      .exit()
      .transition()
      .duration(300)
      .style("opacity", 0)
      .remove();
    
    // Add stack pointer to indicate top
    if (elements.length > 0) {
      container
        .append("polygon")
        .attr(
          "points", 
          `${elementWidth + 10}, 
            ${height - 60 - elements.length * elementHeight + elementHeight / 2 - 5} ${elementWidth + 20}, ${height - 60 - elements.length * elementHeight + elementHeight / 2} ${elementWidth + 10}, ${height - 60 - elements.length * elementHeight + elementHeight / 2 + 5}`)
        .attr("fill", "#e74c3c");
        
      container
        .append("text")
        .attr("x", elementWidth + 25)
        .attr("y", height - 60 - elements.length * elementHeight + elementHeight / 2)
        .attr("dominant-baseline", "middle")
        .attr("fill", "#e74c3c")
        .attr("font-weight", "bold")
        .text("TOP");
    }
    
  }, [elements, operation]);
  
  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef}></svg>
      {operation && (
        <div className="mt-4 p-2 bg-blue-100 rounded">
          <strong>Operation:</strong> {operation}
          <br />
          <strong>Description:</strong> {description}
        </div>
      )}
    </div>
  );
};