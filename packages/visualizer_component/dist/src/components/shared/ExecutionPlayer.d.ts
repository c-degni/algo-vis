import React from 'react';
interface ExecutionStep {
    operation: string;
    description: string;
    state: any;
    highlights?: number[];
    timestamp?: number;
}
interface ExecutionPlayerProps {
    trace: ExecutionStep[];
    onStepChange: (step: ExecutionStep, stepIndex: number) => void;
    isLoading?: boolean;
    playbackSpeed?: number;
    autoPlay?: boolean;
    title?: string;
    dataStructureType?: string;
}
export default function ExecutionPlayer({ trace, onStepChange, isLoading, playbackSpeed, autoPlay, title, dataStructureType }: ExecutionPlayerProps): React.JSX.Element;
export {};
