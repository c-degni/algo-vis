import React, { useState, useEffect } from "react";
import { StackVisualizer } from "./data_structures/StackVisualizer";

const CppStackTester: React.FC = () => {
  const [executionTrace, setExecutionTrace] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Load C++ module (this is Node addon)
  const runStackTest = async () => {
    try {
      // To call your C++ stack through Node addon
      const response = await fetch('/api/cpp/stack-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operations: [
            { type: 'push', value: 10 },
            { type: 'push', value: 20 },
            { type: 'push', value: 30 },
            { type: 'pop' },
            { type: 'push', value: 40 },
            { type: 'pop' },
            { type: 'pop' }
          ]
        })
      });
      
      const data = await response.json();
      setExecutionTrace(JSON.parse(data.trace));
      setCurrentStep(0);
    } catch (error) {
      console.error('Error running stack test:', error);
    }
  };
  
  const playExecution = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= executionTrace.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };
  
  const currentTrace = executionTrace[currentStep];
  const stackElements = currentTrace?.state?.elements?.map((value: number, index: number) => ({
    value,
    index,
    highlighted: currentTrace?.highlights?.includes(index)
  })) || [];
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">C++ Stack Visualization Test</h2>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={runStackTest}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Run Stack Test
        </button>
        <button 
          onClick={playExecution}
          disabled={!executionTrace.length || isPlaying}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
        >
          Play Execution
        </button>
        <button 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Previous Step
        </button>
        <button 
          onClick={() => setCurrentStep(Math.min(executionTrace.length - 1, currentStep + 1))}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Next Step
        </button>
      </div>
      
      <div className="text-sm mb-4">
        Step {currentStep + 1} of {executionTrace.length}
      </div>
      
      <StackVisualizer 
        elements={stackElements}
        operation={currentTrace?.operation}
        description={currentTrace?.description}
      />
    </div>
  );
};

export default CppStackTester;