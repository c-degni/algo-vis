# Algo-Vis
Algo-Vis is an interactive web application for visualizing data structure and algorithm operations with step-by-step execution traces and smooth animations. DSA means data structure/algorithm in the scope of this project.

## Overview
This project combines C++ DSA implementations with a React frontend to provide educational visualizations of stack operations. Users can build custom operation sequences and watch them execute with full playback controls.

## Architecture
`Frontend (React + D3.js) → API (Express) → C++ DSA Implementation → Execution Traces → Visualization`

### Key Components:
- __C++ Layer:__ Tracked data structures with execution tracing using nlohmann/json
- __API Layer:__ Express routes and controllers for operation orchestration
- __Frontend:__ React components with D3.js visualizations and playback controls

## Project Structure
__:electric_plug: API Layer__
- `controllers/{DSA}.js` - Business logic & validation
- `routes/{data-structures or algorithms}.js` - HTTP endpoints & routing

__:zap: C++ Core__
- `core/ExecutionTracer.{h,cpp}` - Records operation steps
- `{data_structures or algorithms}/Tracked{DSA}.h` - {DSA} with execution tracing
- `bindings/{dsa}_wrapper.cpp` - Node.js integration bridge

__:star2: Frontend Components__
- `shared/ExecutionPlayer.tsx` - Playback controls & timeline
- `shared/StepBuilder.tsx` - Interactive operation builder  
- `visualizers/{DSA}Visualizer.tsx` - D3.js stack animations

__:hammer: Build System__
- `build/Release/{data_structures or algorithms}.node` - Compiled C++ addon
- `binding.gyp` - C++ compilation configuration
- `server.js` - Express server entry point

## Features
- __Interactive Operation Builder:__ Add, edit, and sequence DSA operations
- __Step-by-Step Playback:__ Play, pause, and navigate through execution traces
- __Live Visualization:__ D3.js animations with highlighted elements
- __Multiple Data Types:__ Support for int, double, float, and bool DSA
- __Segmented Progress:__ Visual progress bar showing each operation

## Quick Start
### Prerequisites
- Node.js 16+
- C++ compiler (Xcode CLI tools on macOS)
- Python 3.x (for node-gyp)

### Installation & Setup
```bash
# Install dependencies and build C++
npm install
npm run build-cpp

# Start development servers
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- React frontend: http://localhost:3000

### Usage
1. Open http://localhost:3000
1. Navigate to DSA page
1. Build operation sequence (push, pop, etc.)
1. Click "Execute" to see visualization
1. Use playback controls to step through execution

## API Endpoints
- `GET /api/health` - Health check
- `POST /api/{data-structures or algorithms}/{dsa}/execute` - Execute stack operations

### Request format: 
```json
// Stack example
{
    "dataType": "int",
    "operations": [
        {"type": "push", "value": 10},
        {"type": "pop"}
    ]
}
```

## Tech Stack
- __Backend:__ Node.js, Express, N-API
- __Frontend:__ React, TypeScript, D3.js, Tailwind CSS
- __C++:__ nlohmann/json, execution tracing
- __Build:__ node-gyp, concurrently

## Development
```bash
# Backend only
npm start

# Frontend only  
npm run start:react

# Build C++ addon
npm run build-cpp

# Clean build artifacts
npm run clean
```

## Contributions
The architecture supports easy addition of new data structures:

1. Create C++ tracked implementation in `cpp/{data_structures or algorithms}/`
1. Add wrapper in `cpp/translation/`
1. Create controller in `api/controllers/`
1. Add React visualizer in `components/visualizers/`

If you add a new data structure/algorithm, please consider adding a preset of operations for said data structure/algorithm so that users can have a base visualization to start with. THAT WOULD BE HEAVILY APPRECIATED :pray:! 

Currently no algorithms have been implemented but they follow a similar structure to that of data structures. Certain routes will have to be added etc. but many things may already be done and commented out :wink:.

Thanks for checking out Algo-Vis! Feel free to reach out to me on [github](https://github.com/c-degni), [linkedin](https://www.linkedin.com/in/christ-degni/), and/or at degnicn@mail.uc.edu.