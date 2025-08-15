import React, { useState, useCallback } from 'react';
import ExecutionPlayer from '../shared/ExecutionPlayer';
import InteractiveStepBuilder from '../shared/StepBuilder';
import StackVisualizer from '../visualizers/data_structures/StackVisualizer';

interface ExecutionStep {
    operation: string;
    description: string;
    state: any;
    highlights?: number[];
    timestamp?: number;
}

export default function StackPage() {
    const [trace, setTrace] = useState<ExecutionStep[]>([]);
    const [currentState, setCurrentState] = useState<any>(null);
    const [currentHighlights, setCurrentHighlights] = useState<number[]>([]);
    const [isExecuting, setIsExecuting] = useState(false);

    const handleExecuteOperations = useCallback(async (operations: any[]) => {
        setIsExecuting(true);
        try {
            const response = await fetch('/api/data-structures/stack/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dataType: 'int',
                    operations: operations.map(op => ({
                        type: op.type,
                        value: op.value
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);  
            }

            const data = await response.json();
            setTrace(data.trace || []);
            
            // Init state
            if (data.trace && data.trace.length > 0) {
                setCurrentState(data.trace[0].state);
                setCurrentHighlights(data.trace[0].highlights || []);
            }
        } catch (error) {
            console.error('Failed to execute operations:', error);
            alert('Failed to execute operations. Make sure the backend is running.');
        } finally {
            setIsExecuting(false);
        }
    }, []);

    const handleStepChange = useCallback((step: ExecutionStep, stepIndex: number) => {
        setCurrentState(step.state);
        setCurrentHighlights(step.highlights || []);
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Stack Visualizer</h1>
                <p className="text-gray-600">
                    Build a sequence of stack operations and watch them execute step by step.
                </p>
            </div>

            <InteractiveStepBuilder
                dataStructureType="stack"
                dataType="int"
                onExecute={handleExecuteOperations}
                isExecuting={isExecuting}
            />

            {trace.length > 0 && (
                <>
                    <ExecutionPlayer
                        trace={trace}
                        onStepChange={handleStepChange}
                        title="Stack Operations"
                        dataStructureType="stack"
                        isLoading={isExecuting}
                    />

                    <StackVisualizer
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