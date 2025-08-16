import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Square, RotateCcw } from 'lucide-react';

interface ExecutionStep {
  operation: string;
  description: string;
  state: any;
  highlights?: number[];
  timestamp?: number;
  // metadata?: {
  //   complexity?: string;
  //   memoryUsage?: number;
  //   comparisons?: number;
  // };
}

interface ExecutionPlayerProps {
  trace: ExecutionStep[];
  onStepChange: (step: ExecutionStep, stepIndex: number) => void;
  isLoading?: boolean;
  playbackSpeed?: number;
  autoPlay?: boolean;
  // showMetadata?: boolean;
  title?: string;
  dataStructureType?: string;
}

export default function ExecutionPlayer({ 
  trace = [], 
  onStepChange,
  isLoading = false,
  playbackSpeed = 1000,
  autoPlay = false,
  // showMetadata = true,
  title = "Algorithm Visualization",
  dataStructureType = "unknown"
}: ExecutionPlayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [speed, setSpeed] = useState(playbackSpeed);

  // Notify parent component when step changes
  useEffect(() => {
    if (trace.length > 0 && trace[currentStep]) {
      onStepChange(trace[currentStep], currentStep);
    }
  }, [currentStep, trace, onStepChange]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || trace.length === 0) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= trace.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, trace.length]);

  const handlePlay = useCallback(() => {
    if (currentStep >= trace.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentStep, trace.length]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handlePrevious = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(trace.length - 1, prev + 1));
  }, [trace.length]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newStep = parseInt(e.target.value);
    setCurrentStep(newStep);
    setIsPlaying(false);
  }, []);

  const currentTrace = trace[currentStep];
  const progress = trace.length > 0 ? (currentStep / (trace.length - 1)) * 100 : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="capitalize">{dataStructureType} Visualization</span>
          <span>{trace.length} steps</span>
        </div>
      </div>

      {/* Current Operation Display */}
      {currentTrace && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-blue-800">
              Step {currentStep + 1}: {currentTrace.operation}
            </h3>
            {/* {showMetadata && currentTrace.metadata?.complexity && (
              <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {currentTrace.metadata.complexity}
              </span>
            )} */}
          </div>
          <p className="text-gray-700">{currentTrace.description}</p>
        </div>
      )}

      {/* Segmented Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
          <span>Progress</span>
          <span>Step {currentStep + 1} of {trace.length}</span>
        </div>
        <div className="relative">
          {/* Segmented progress bar */}
          <div className="flex h-3 bg-gray-200 rounded-full overflow-hidden">
            {trace.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const segmentWidth = trace.length > 0 ? (100 / trace.length) : 0;
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-300 ${
                    isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                  } ${index > 0 ? 'border-l border-white' : ''}`}
                  style={{ width: `${segmentWidth}%` }}
                  title={`Step ${index + 1}: ${step.operation}`}
                />
              );
            })}
          </div>
          <label htmlFor="progress-steps-slider" className="sr-only">
            Progress steps slider
          </label>
          <input id='progress-steps-slider' className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer" />
        </div>
        
        {/* Operation labels below progress bar */}
        {trace.length > 0 && trace.length <= 10 && (
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {trace.map((step, index) => (
              <span 
                key={index} 
                className={`cursor-pointer hover:text-gray-700 ${
                  index === currentStep ? 'font-semibold text-blue-600' : ''
                }`}
                onClick={() => setCurrentStep(index)}
                title={step.description}
              >
                {step.operation}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <button
          onClick={handleStop}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="Stop and reset"
        >
          <Square size={20} />
        </button>
        
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous step"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={handlePlay}
          disabled={trace.length === 0}
          className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={handleNext}
          disabled={currentStep >= trace.length - 1}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next step"
        >
          <SkipForward size={20} />
        </button>

        <button
          onClick={() => setCurrentStep(0)}
          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Reset to beginning"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex items-center justify-center space-x-4">
        <label htmlFor="speed-label" className="text-sm text-gray-600">
          Speed:
        </label>
        <input
          id="speed-label"
          type="range"
          min="100"
          max="3000"
          step="100"
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-gray-600 w-12">
          {(3000 - speed + 100) / 1000}x
        </span>
      </div>

      {/* Metadata Panel */}
      {/* {showMetadata && currentTrace?.metadata && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Step Metadata</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {currentTrace.metadata.complexity && (
              <div>
                <span className="text-gray-600">Complexity:</span>
                <span className="ml-2 font-mono">{currentTrace.metadata.complexity}</span>
              </div>
            )}
            {currentTrace.metadata.memoryUsage && (
              <div>
                <span className="text-gray-600">Memory:</span>
                <span className="ml-2 font-mono">{currentTrace.metadata.memoryUsage} bytes</span>
              </div>
            )}
            {currentTrace.metadata.comparisons !== undefined && (
              <div>
                <span className="text-gray-600">Comparisons:</span>
                <span className="ml-2 font-mono">{currentTrace.metadata.comparisons}</span>
              </div>
            )}
            {currentTrace.timestamp && (
              <div>
                <span className="text-gray-600">Timestamp:</span>
                <span className="ml-2 font-mono">{currentTrace.timestamp}ms</span>
              </div>
            )}
          </div>
        </div>
      )} */}

      {/* Debug Info (development only) */}
      {/* {typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && (
        <details className="mt-4 text-xs text-gray-500">
          <summary className="cursor-pointer">Debug Info</summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(currentTrace, null, 2)}
          </pre>
        </details>
      )} */}
    </div>
  );
}