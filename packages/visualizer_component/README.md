# Data Structure Visualizer Component
A portable React component package for integrating interactive data structure and algorithm visualizations into any web application.

## Overview
This package provides plug-and-play visualization components that accept operation traces and render smooth D3.js animations with full playback controls. Perfect for educational platforms and coding tutorials!

## Architecture
`Your API → Component → D3.js Visualization + Playback Controls`

### Key Components:
- __VisualizationContainer:__ Main wrapper component that handles API calls
- __ExecutionPlayer:__ Universal playback controls (play, pause, step, seek)
- __DSA Visualizers:__ D3.js animated components for stack, queue, trees, etc.

## Installation
```bash
npm install @c-degni/algo-vis
```
## Quick Start
### Basic Usage
```tsx
// Stack example
import { VisualizationContainer } from '@c-degni/algo-vis';

function MyApp() {
    const operations = [
        { type: 'push', value: 10 },
        { type: 'push', value: 20 },
        { type: 'pop' }
    ];

    return (
        <VisualizationContainer
            apiEndpoint="https://your-api.com/stack-execute"
            dataStructure="stack"
            dataType="int"
            operations={operations}
            onError={(err) => console.error(err)}
        />
    );
}
```

### Advanced Usage (Individual Components)
```tsx
import { ExecutionPlayer, {DSA}Visualizer } from '@c-degni/algo-vis';

function CustomVisualization() {
    const [trace, setTrace] = useState([]);
    const [currentState, setCurrentState] = useState(null);

    return (
        <div>
            <ExecutionPlayer
                trace={trace}
                onStepChange={(step) => setCurrentState(step.state)}
                title="Custom {DSA} Demo"
                dataStructureType="{dsa}"
            />
            <StackVisualizer
                elements={currentState?.elements || []}
                highlights={currentState?.highlights || []}
            />
        </div>
    );
}
```

## API Requirements
Your backend must return execution traces in this format:
```json
// Stack example
{
    "trace": [
        {
            "operation": "push",
            "description": "Pushed 10 to stack",
            "state": {
                "elements": [10],
                "size": 1
            },
            "highlights": [0],
            "timestamp": 1231231231231
        },
        {
            "operation": "pop",
            "description": "Popped 10 from stack", 
            "state": {
                "elements": [],
                "size": 0
            },
            "highlights": [],
            "timestamp": 1231231231232
        }
    ]
}
```

### Request Format
```json
// Stack example
// POST /api/data-structures/stack/execute
{
    "dataType": "int",
    "operations": [
        { "type": "push", "value": 10 },
        { "type": "pop" }
    ]
}
```

## Features
- :electric_plug: __Zero Backend Coupling:__ Works with any API matching the trace format
- :ocean: __Smooth Animations:__ D3.js powered visualizations with highlights
- :zap: __Full Playback Controls:__ Play, pause, step, seek through executions
- :hammer: __Multiple Data Types:__ Support for int, double, float, bool data types
- :package: __Responsive Design:__ Works on desktop and mobile

## Integration Example
### Educational Platform
```tsx
// Student coding exercise with live visualization of
// reversing a string using a stack
const studentCode = [
    { type: 'push', value: 'h' },
    { type: 'push', value: 'e' },
    { type: 'push', value: 'l' },
    { type: 'push', value: 'l' },
    { type: 'push', value: 'o' },
    { type: 'pop' },  // 'o'
    { type: 'pop' },  // 'l'
    { type: 'pop' }   // 'l' ...
];

<VisualizationContainer
    apiEndpoint="/api/student/stack-exercise"
    dataStructure="stack"
    dataType="int"
    operations={studentCode}
/>
```

## Development
```bash
# Install dependencies
npm install

# Build package
npm run build
```

## Contributing
This package is extracted from [Algo-Vis](https://github.com/c-degni/algo-vis). Feel free to contribute to the Algo-Vis repository!
Updates will be synced to this package in releases.

## License
MIT - See LICENSE for details

Thanks for using the Data Structure Visualizer Component :raised_hands:!