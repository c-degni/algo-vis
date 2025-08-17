import React from 'react';
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
export default function VisualizationContainer({ apiEndpoint, dataStructure, dataType, operations, onError }: VisualizationContainerProps): React.JSX.Element;
export {};
