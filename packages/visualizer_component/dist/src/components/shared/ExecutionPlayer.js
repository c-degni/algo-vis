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
exports.default = ExecutionPlayer;
var react_1 = __importStar(require("react"));
var lucide_react_1 = require("lucide-react");
function ExecutionPlayer(_a) {
    var _b = _a.trace, trace = _b === void 0 ? [] : _b, onStepChange = _a.onStepChange, _c = _a.isLoading, isLoading = _c === void 0 ? false : _c, _d = _a.playbackSpeed, playbackSpeed = _d === void 0 ? 1000 : _d, _e = _a.autoPlay, autoPlay = _e === void 0 ? false : _e, 
    // showMetadata = true,
    _f = _a.title, 
    // showMetadata = true,
    title = _f === void 0 ? "Algorithm Visualization" : _f, _g = _a.dataStructureType, dataStructureType = _g === void 0 ? "unknown" : _g;
    var _h = (0, react_1.useState)(0), currentStep = _h[0], setCurrentStep = _h[1];
    var _j = (0, react_1.useState)(autoPlay), isPlaying = _j[0], setIsPlaying = _j[1];
    var _k = (0, react_1.useState)(playbackSpeed), speed = _k[0], setSpeed = _k[1];
    // Notify parent component when step changes
    (0, react_1.useEffect)(function () {
        if (trace.length > 0 && trace[currentStep]) {
            onStepChange(trace[currentStep], currentStep);
        }
    }, [currentStep, trace, onStepChange]);
    // Auto-play functionality
    (0, react_1.useEffect)(function () {
        if (!isPlaying || trace.length === 0)
            return;
        var interval = setInterval(function () {
            setCurrentStep(function (prev) {
                if (prev >= trace.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, speed);
        return function () { return clearInterval(interval); };
    }, [isPlaying, speed, trace.length]);
    var handlePlay = (0, react_1.useCallback)(function () {
        if (currentStep >= trace.length - 1) {
            setCurrentStep(0);
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying, currentStep, trace.length]);
    var handleStop = (0, react_1.useCallback)(function () {
        setIsPlaying(false);
        setCurrentStep(0);
    }, []);
    var handlePrevious = (0, react_1.useCallback)(function () {
        setIsPlaying(false);
        setCurrentStep(function (prev) { return Math.max(0, prev - 1); });
    }, []);
    var handleNext = (0, react_1.useCallback)(function () {
        setIsPlaying(false);
        setCurrentStep(function (prev) { return Math.min(trace.length - 1, prev + 1); });
    }, [trace.length]);
    var handleSliderChange = (0, react_1.useCallback)(function (e) {
        var newStep = parseInt(e.target.value);
        setCurrentStep(newStep);
        setIsPlaying(false);
    }, []);
    var currentTrace = trace[currentStep];
    if (isLoading) {
        return (react_1.default.createElement("div", { className: "bg-white rounded-lg shadow-lg p-6" },
            react_1.default.createElement("div", { className: "animate-pulse" },
                react_1.default.createElement("div", { className: "h-4 bg-gray-200 rounded w-1/4 mb-4" }),
                react_1.default.createElement("div", { className: "h-12 bg-gray-200 rounded mb-4" }),
                react_1.default.createElement("div", { className: "h-8 bg-gray-200 rounded w-1/2" }))));
    }
    return (react_1.default.createElement("div", { className: "bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto" },
        react_1.default.createElement("div", { className: "mb-6" },
            react_1.default.createElement("h2", { className: "text-2xl font-bold text-gray-800 mb-2" }, title),
            react_1.default.createElement("div", { className: "flex items-center justify-between text-sm text-gray-600" },
                react_1.default.createElement("span", { className: "capitalize" },
                    dataStructureType,
                    " Visualization"),
                react_1.default.createElement("span", null,
                    trace.length,
                    " steps"))),
        currentTrace && (react_1.default.createElement("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400" },
            react_1.default.createElement("div", { className: "flex items-center justify-between mb-2" },
                react_1.default.createElement("h3", { className: "text-lg font-semibold text-blue-800" },
                    "Step ",
                    currentStep + 1,
                    ": ",
                    currentTrace.operation)),
            react_1.default.createElement("p", { className: "text-gray-700" }, currentTrace.description))),
        react_1.default.createElement("div", { className: "mb-6" },
            react_1.default.createElement("div", { className: "flex items-center justify-between mb-2 text-sm text-gray-600" },
                react_1.default.createElement("span", null, "Progress"),
                react_1.default.createElement("span", null,
                    "Step ",
                    currentStep + 1,
                    " of ",
                    trace.length)),
            react_1.default.createElement("div", { className: "relative" },
                react_1.default.createElement("div", { className: "flex h-3 bg-gray-200 rounded-full overflow-hidden" }, trace.map(function (step, index) {
                    var isCompleted = index < currentStep;
                    var isCurrent = index === currentStep;
                    var segmentWidth = trace.length > 0 ? (100 / trace.length) : 0;
                    return (react_1.default.createElement("div", { key: index, className: "transition-all duration-300 ".concat(isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300', " ").concat(index > 0 ? 'border-l border-white' : ''), style: { width: "".concat(segmentWidth, "%") }, title: "Step ".concat(index + 1, ": ").concat(step.operation) }));
                })),
                react_1.default.createElement("label", { htmlFor: "progress-steps-slider", className: "sr-only" }, "Progress steps slider"),
                react_1.default.createElement("input", { id: 'progress-steps-slider', className: "absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer" })),
            trace.length > 0 && trace.length <= 10 && (react_1.default.createElement("div", { className: "flex justify-between mt-2 text-xs text-gray-500" }, trace.map(function (step, index) { return (react_1.default.createElement("span", { key: index, className: "cursor-pointer hover:text-gray-700 ".concat(index === currentStep ? 'font-semibold text-blue-600' : ''), onClick: function () { return setCurrentStep(index); }, title: step.description }, step.operation)); })))),
        react_1.default.createElement("div", { className: "flex items-center justify-center space-x-4 mb-4" },
            react_1.default.createElement("button", { onClick: handleStop, className: "p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors", title: "Stop and reset" },
                react_1.default.createElement(lucide_react_1.Square, { size: 20 })),
            react_1.default.createElement("button", { onClick: handlePrevious, disabled: currentStep === 0, className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", title: "Previous step" },
                react_1.default.createElement(lucide_react_1.SkipBack, { size: 20 })),
            react_1.default.createElement("button", { onClick: handlePlay, disabled: trace.length === 0, className: "p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed", title: isPlaying ? "Pause" : "Play" }, isPlaying ? react_1.default.createElement(lucide_react_1.Pause, { size: 24 }) : react_1.default.createElement(lucide_react_1.Play, { size: 24 })),
            react_1.default.createElement("button", { onClick: handleNext, disabled: currentStep >= trace.length - 1, className: "p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed", title: "Next step" },
                react_1.default.createElement(lucide_react_1.SkipForward, { size: 20 })),
            react_1.default.createElement("button", { onClick: function () { return setCurrentStep(0); }, className: "p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors", title: "Reset to beginning" },
                react_1.default.createElement(lucide_react_1.RotateCcw, { size: 20 }))),
        react_1.default.createElement("div", { className: "flex items-center justify-center space-x-4" },
            react_1.default.createElement("label", { htmlFor: "speed-label", className: "text-sm text-gray-600" }, "Speed:"),
            react_1.default.createElement("input", { id: "speed-label", type: "range", min: "100", max: "3000", step: "100", value: speed, onChange: function (e) { return setSpeed(parseInt(e.target.value)); }, className: "w-32" }),
            react_1.default.createElement("span", { className: "text-sm text-gray-600 w-12" },
                (3000 - speed + 100) / 1000,
                "x"))));
}
