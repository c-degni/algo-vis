import React, { useState, useCallback, useEffect } from 'react';
import ExecutionPlayer from '../shared/ExecutionPlayer';
import StepBuilder from '../shared/StepBuilder';
import QueueVisualizer from '../visualizers/data_structures/QueueVisualizer';

interface ExecutionStep {
    operation: string;
    description: string;
    state: any;
    highlights?: number[];
    timestamp?: number;
}

export default function QueuePage() {
    const [trace, setTrace] = useState<ExecutionStep[]>([]);
    const [currentState, setCurrentState] = useState<any>(null);
    const [currentHighlights, setCurrentHighlights] = useState<number[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);
    const [dataType, setDataType] = useState<'int' | 'double' | 'float' | 'bool' | 'string'>('int');

    useEffect(() => {
        setTrace([]);
        setCurrentState(null);
        setCurrentHighlights([]);
    }, [dataType]);

    const handleExecuteOperations = useCallback(async (operations: any[]) => {
        setIsExecuting(true);
        try {
            const response = await fetch('/api/data-structures/queue/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dataType: dataType,
                    operations: operations.map(op => ({
                        type: op.type,
                        value: op.value
                    }))
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errorType === 'QUEUE_UNDERFLOW') {
                    throw new Error('Queue Underflow: Cannot dequeue from or view front of empty queue!');
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);  
                }
            }

            setTrace(data.trace || []);
            
            // Init state
            if (data.trace && data.trace.length > 0) {
                setCurrentState(data.trace[0].state);
                setCurrentHighlights(data.trace[0].highlights || []);
            }
        } catch (error) {
            console.error('Failed to execute operations:', error);
            if (error.message.includes('Queue Underflow')) {  
                alert(`${error.message}`);
            } else {
                alert(`Failed to execute operations. Make sure the backend is running.\n${error.message}`);
            }
        } finally {
            setIsExecuting(false);
        }
    }, [dataType]);

    const handleStepChange = useCallback((step: ExecutionStep, stepIndex: number) => {
        setCurrentState(step.state);
        setCurrentHighlights(step.highlights || []);
    }, []);

    return (
        <div className="space-y-6">
            {/* Data Type Selector */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Queue Visualizer</h1>
                <div className="flex items-center space-x-4 mb-4">
                    <label 
                        className="text-sm font-medium text-gray-700"
                        htmlFor='dataType'
                    >
                        Data Type:
                    </label>
                    <select 
                        id='dataType'
                        value={dataType} 
                        onChange={(e) => setDataType(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="int">Integer</option>
                        <option value="double">Double</option>
                        <option value="float">Float</option>
                        <option value="bool">Boolean</option>
                        <option value="string">String</option>
                    </select>
                </div>
                <p className="text-gray-600">
                    Build a sequence of queue operations and watch them execute step by step.
                </p>
            </div>


            <StepBuilder
                key={dataType}
                dataStructureType="queue"
                dataType={dataType}
                onDataTypeChange={setDataType}
                onExecute={handleExecuteOperations}
                isExecuting={isExecuting}
            />

            {trace.length > 0 && (
                <>
                    <ExecutionPlayer
                        trace={trace}
                        onStepChange={handleStepChange}
                        title="Queue Operations"
                        dataStructureType="queue"
                        isLoading={isExecuting}
                    />

                    <QueueVisualizer
                        elements={currentState?.elements || []}
                        highlights={currentHighlights}
                    />
                </>
            )}

            {trace.length === 0 && !isExecuting && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <p className="text-gray-500 text-lg">
                        Add some operations above and click "Execute" to see the visualization!
                    </p>
                </div>
            )}
        </div>
    );
}