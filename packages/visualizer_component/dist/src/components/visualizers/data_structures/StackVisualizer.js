"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StackVisualizer;
var react_1 = __importStar(require("react"));
var d3 = __importStar(require("d3"));
function StackVisualizer(_a) {
    var _b = _a.elements, elements = _b === void 0 ? [] : _b, _c = _a.highlights, highlights = _c === void 0 ? [] : _c;
    var svgRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (!svgRef.current)
            return;
        var svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();
        var width = 400;
        var height = Math.max(300, elements.length * 60 + 100);
        var elementHeight = 50;
        var elementWidth = 200;
        svg.attr('width', width).attr('height', height);
        // Draw stack elements
        var stackGroups = svg.selectAll('.stack-element')
            .data(elements)
            .enter()
            .append('g')
            .attr('class', 'stack-element')
            .attr('transform', function (d, i) {
            return "translate(".concat((width - elementWidth) / 2, ", ").concat(height - 80 - (i + 1) * elementHeight, ")");
        });
        // Draw rectangles
        stackGroups.append('rect')
            .attr('width', elementWidth)
            .attr('height', elementHeight - 5)
            .attr('fill', function (d, i) { return highlights.includes(i) ? '#3B82F6' : '#E5E7EB'; })
            .attr('stroke', '#374151')
            .attr('stroke-width', 2)
            .attr('rx', 5);
        // Draw text
        stackGroups.append('text')
            .attr('x', elementWidth / 2)
            .attr('y', elementHeight / 2 - 2)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', function (d, i) { return highlights.includes(i) ? 'white' : '#1F2937'; })
            .attr('font-size', '18')
            .attr('font-weight', 'bold')
            .text(function (d) { return d; });
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
    return (react_1.default.createElement("div", { className: "bg-white rounded-lg shadow-lg p-6" },
        react_1.default.createElement("h3", { className: "text-xl font-semibold text-gray-800 mb-4" }, "Stack Visualization"),
        react_1.default.createElement("div", { className: "flex justify-center" },
            react_1.default.createElement("svg", { ref: svgRef })),
        elements.length === 0 && (react_1.default.createElement("div", { className: "text-center text-gray-500 py-8" },
            react_1.default.createElement("p", null, "Stack is empty")))));
}
