import React, { useState, useCallback } from 'react';
import ExecutionPlayer from '../../../src/components/shared/ExecutionPlayer';
import StackVisualizer from '../../../src/components/visualizers/data_structures/StackVisualizer';

interface Operation {
    type: string;
    value?: any;
}

interface VisualizationContainerProps {
    apiEndpoint: string;
    dataStructure: 'stack';
    dataType: 'int' | 'double' | 'float' | 'bool';
    operations: Operation[];
    onError?: (error: string) => void;
}

export default function VisualizationContainer({
    apiEndpoint,
    dataStructure,
    dataType,
    operations,
    onError
} : VisualizationContainerProps) {
    const [trace, setTrace] = useState([]);
    const [currentState, setCurrentState] = useState(null);
    const [currentHighlights, setCurrentHighlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const executeOperations = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dataType, operations })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            setTrace(data.trace || []);
            
            if (data.trace?.length > 0) {
                setCurrentState(data.trace[0].state);
                setCurrentHighlights(data.trace[0].highlights || []);
            }
        } catch (error) {
            onError?.(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, dataType, operations, onError]);

    const handleStepChange = useCallback((step, stepIndex) => {
        setCurrentState(step.state);
        setCurrentHighlights(step.highlights || []);
    }, []);

    const renderVisualizer = () => {
        switch (dataStructure) {
            case 'stack':
                return (
                    <StackVisualizer
                        elements={currentState?.elements || []}
                        highlights={currentHighlights}
                    />
                );
            default:
                return <div>Visualizer for {dataStructure} not implemented</div>;
            }
    };

    return (
        <div className="space-y-6">
            <button onClick={executeOperations} disabled={isLoading}>
                {isLoading ? 'Executing...' : 'Execute Operations'}
            </button>
            
            {trace.length > 0 && (
                <>
                    <ExecutionPlayer
                        trace={trace}
                        onStepChange={handleStepChange}
                        title={`${dataStructure} operations`}
                        dataStructureType={dataStructure}
                    />
                    {renderVisualizer()}
                </>
            )}
        </div>
    );
}