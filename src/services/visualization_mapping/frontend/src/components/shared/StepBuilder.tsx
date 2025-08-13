import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Play, RotateCcw, Edit3 } from 'lucide-react';

const UID_NUMBER_LEN: number = 9;

interface Operation {
    id: string;
    type: string;
    value?: any;
    description?: string;
}

interface StepBuilderProps {
    dataStructureType: 'stack';
    dataType: 'int' | 'double' | 'float' | 'bool';
    onExecute: (operations: Operation[]) => void;
    isExecuting?: boolean;
}

const DATA_STRUCTURE_OPERATIONS = {
    stack: [
        { type: 'push', needsValue: true, description: 'Add element to top' },
        { type: 'pop', needsValue: false, description: 'Remove top element' },
        { type: 'top', needsValue: false, description: 'View top element' },
        { type: 'size', needsValue: false, description: 'Get size' },
        { type: 'empty', needsValue: false, description: 'Check if empty' },
        { type: 'clear', needsValue: false, description: 'Remove all elements' }
    ],
    // Queue next
};

const PRESET_SEQUENCES = {
    stack: [
      {
        name: 'LIFO Demo',
        operations: [
          { type: 'push', value: 10 },
          { type: 'push', value: 20 },
          { type: 'push', value: 30 },
          { type: 'top' },
          { type: 'pop' },
          { type: 'pop' }
        ]
      }
    ],
    // Queue next
};

export default function StepBuilder({
    dataStructureType,
    dataType,
    onExecute,
    isExecuting = false
}: StepBuilderProps) {
    const [operations, setOperations] = useState<Operation[]>([]);
    const [newOperation, setNewOperation] = useState({
        type: '',
        value: ''
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const availableOperations = DATA_STRUCTURE_OPERATIONS[dataStructureType] || [];
    const presets = PRESET_SEQUENCES[dataStructureType] || [];

    // Will create unique id op_{epoch}_{random 9 digit num}
    // 2 in the substring is for the beginning "0."
    const generateId = (): string => `op_${Date.now()}_${Math.random().toString(36).substring(2, 2 + UID_NUMBER_LEN)}`;

    const parseValue = useCallback((valueStr: string, type: string) => {
        if (!valueStr.trim()) return undefined;
        switch (type) {
            case 'int':
                return parseInt(valueStr);
            case 'double':
            case 'float':
                return parseFloat(valueStr);
            case 'bool':
                return valueStr.toLowerCase() === 'true';
            case 'string':
            default:
                return valueStr;
        }
    }, []);

    const addOperation = useCallback(() => {
        if (!newOperation.type) return;
    
        const operationDef = availableOperations.find(op => op.type === newOperation.type);
        if (!operationDef) return;
    
        const operation: Operation = {
          id: generateId(),
          type: newOperation.type,
          description: operationDef.description
        };
    
        if (operationDef.needsValue && newOperation.value) {
          operation.value = parseValue(newOperation.value, dataType);
        }
    
        setOperations(prev => [...prev, operation]);
        setNewOperation({ type: '', value: '' });
    }, [newOperation, availableOperations, dataType, parseValue]);    

    const removeOperation = useCallback((id: string) => {
        setOperations(prev => prev.filter(op => op.id !== id));
    }, []);
    
    const editOperation = useCallback((id: string) => {
        const op = operations.find(op => op.id === id);
        if (op) {
            setEditingId(id);
            setNewOperation({
                type: op.type,
                value: op.value?.toString() || ''
            });
        }
    }, [operations]);

    const updateOperation = useCallback(() => {
        if (!editingId) return;
    
        const operationDef = availableOperations.find(op => op.type === newOperation.type);
        if (!operationDef) return;
    
        const updatedOperation: Operation = {
          id: editingId,
          type: newOperation.type,
          description: operationDef.description
        };
    
        if (operationDef.needsValue && newOperation.value) {
          updatedOperation.value = parseValue(newOperation.value, dataType);
        }
    
        setOperations(prev => prev.map(op => op.id === editingId ? updatedOperation : op));
        setEditingId(null);
        setNewOperation({ type: '', value: '' });
    }, [editingId, newOperation, availableOperations, dataType, parseValue]);
    
    const clearOperations = useCallback(() => {
        setOperations([]);
        setEditingId(null);
        setNewOperation({ type: '', value: '' });
    }, []);
    
    const loadPreset = useCallback((preset: any) => {
        const presetOpsWithIds = preset.operations.map((op: any) => ({
          ...op,
          id: generateId()
        }));
        setOperations(presetOpsWithIds);
    }, []);
    
    const executeSequence = useCallback(() => {
        if (operations.length === 0) return;
        onExecute(operations);
    }, [operations, onExecute]);

    const selectedOperation = availableOperations.find(op => op.type === newOperation.type);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Build {dataStructureType ? dataStructureType.charAt(0).toUpperCase() + dataStructureType.slice(1) : 'Data Structure'} Operations
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Data Type: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{dataType}</span></span>
                    <span>Operations: {operations.length}</span>
                </div>
            </div>
    
            {/* Preset Sequences */}
            {presets.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Quick Start Presets</h3>
                    <div className="flex flex-wrap gap-2">
                    {presets.map((preset, index) => (
                        <button
                        key={index}
                        onClick={() => loadPreset(preset)}
                        className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                        {preset.name}
                        </button>
                    ))}
                    </div>
                </div>
            )}
    
            {/* Operation Builder */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                {editingId ? 'Edit Operation' : 'Add New Operation'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Operation Type */}
                    <div>
                        <label 
                            htmlFor="operation"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Operation
                        </label>
                        <select
                            id="operation"
                            value={newOperation.type}
                            onChange={(e) => setNewOperation(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select operation...</option>
                            {availableOperations.map(op => (
                                <option key={op.type} value={op.type}>
                                    {op.type} - {op.description}
                                </option>
                            ))}
                        </select>
                    </div>
        
                    {/* Value Input */}
                    {selectedOperation?.needsValue && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Value ({dataType})
                            </label>
                            <input
                                type={dataType === 'bool' ? 'text' : dataType === 'int' ? 'number' : 'text'}
                                value={newOperation.value}
                                onChange={(e) => setNewOperation(prev => ({ ...prev, value: e.target.value }))}
                                placeholder={dataType === 'bool' ? 'true/false' : `Enter ${dataType} value`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    )}
        
                    {/* Add/Update Button */}
                    <div>
                        <button
                            onClick={editingId ? updateOperation : addOperation}
                            disabled={!newOperation.type || (selectedOperation?.needsValue && !newOperation.value)}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {editingId ? <Edit3 size={16} /> : <Plus size={16} />}
                            <span>{editingId ? 'Update' : 'Add'}</span>
                        </button>
                    </div>
                </div>
        
                {editingId && (
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setNewOperation({ type: '', value: '' });
                        }}
                        className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Cancel editing
                    </button>
                )}
            </div>
        
            {/* Operations List */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Operation Sequence</h3>
                    <button
                        onClick={clearOperations}
                        disabled={operations.length === 0}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                    >
                        <RotateCcw size={14} />
                        <span>Clear All</span>
                    </button>
                </div>
        
                {operations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No operations added yet.</p>
                        <p className="text-sm">Add operations above to build your sequence.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {operations.map((op, index) => (
                            <div
                                key={op.id}
                                className={`flex items-center justify-between p-3 border rounded-lg ${
                                    editingId === op.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                                }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-mono text-gray-500 w-8">#{index + 1}</span>
                                    <div>
                                        <span className="font-semibold text-gray-800">{op.type}</span>
                                        {op.value !== undefined && (
                                            <span className="ml-2 text-blue-600 font-mono">({op.value})</span>
                                        )}
                                        {op.description && (
                                            <span className="ml-2 text-sm text-gray-600">- {op.description}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => editOperation(op.id)}
                                        className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                        title="Edit operation"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => removeOperation(op.id)}
                                        className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                        title="Remove operation"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        
            {/* Execute Button */}
            <div className="flex justify-center">
                <button
                    onClick={executeSequence}
                    disabled={operations.length === 0 || isExecuting}
                    className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-lg font-semibold"
                >
                    <Play size={20} />
                    <span>{isExecuting ? 'Executing...' : `Execute ${operations.length} Operations`}</span>
                </button>
            </div>
        
            {/* Operation Summary */}
            {operations.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Execution Preview</h4>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-mono">
                        {operations.map((op, index) => (
                            <div key={op.id}>
                                {index + 1}. {op.type}
                                {op.value !== undefined && `(${op.value})`}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}