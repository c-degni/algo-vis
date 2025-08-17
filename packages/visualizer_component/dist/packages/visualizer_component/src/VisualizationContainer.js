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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VisualizationContainer;
var react_1 = __importStar(require("react"));
var ExecutionPlayer_1 = __importDefault(require("../../../src/components/shared/ExecutionPlayer"));
var StackVisualizer_1 = __importDefault(require("../../../src/components/visualizers/data_structures/StackVisualizer"));
function VisualizationContainer(_a) {
    var _this = this;
    var apiEndpoint = _a.apiEndpoint, dataStructure = _a.dataStructure, dataType = _a.dataType, operations = _a.operations, onError = _a.onError;
    var _b = (0, react_1.useState)([]), trace = _b[0], setTrace = _b[1];
    var _c = (0, react_1.useState)(null), currentState = _c[0], setCurrentState = _c[1];
    var _d = (0, react_1.useState)([]), currentHighlights = _d[0], setCurrentHighlights = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var executeOperations = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var response, data, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setIsLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(apiEndpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ dataType: dataType, operations: operations })
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok)
                        throw new Error("HTTP ".concat(response.status));
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _b.sent();
                    setTrace(data.trace || []);
                    if (((_a = data.trace) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        setCurrentState(data.trace[0].state);
                        setCurrentHighlights(data.trace[0].highlights || []);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _b.sent();
                    onError === null || onError === void 0 ? void 0 : onError(error_1.message);
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [apiEndpoint, dataType, operations, onError]);
    var handleStepChange = (0, react_1.useCallback)(function (step, stepIndex) {
        setCurrentState(step.state);
        setCurrentHighlights(step.highlights || []);
    }, []);
    var renderVisualizer = function () {
        switch (dataStructure) {
            case 'stack':
                return (react_1.default.createElement(StackVisualizer_1.default, { elements: (currentState === null || currentState === void 0 ? void 0 : currentState.elements) || [], highlights: currentHighlights }));
            default:
                return react_1.default.createElement("div", null,
                    "Visualizer for ",
                    dataStructure,
                    " not implemented");
        }
    };
    return (react_1.default.createElement("div", { className: "space-y-6" },
        react_1.default.createElement("button", { onClick: executeOperations, disabled: isLoading }, isLoading ? 'Executing...' : 'Execute Operations'),
        trace.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(ExecutionPlayer_1.default, { trace: trace, onStepChange: handleStepChange, title: "".concat(dataStructure, " operations"), dataStructureType: dataStructure }),
            renderVisualizer()))));
}
