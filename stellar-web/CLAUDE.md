# CLAUDE.md - Stellar Web

## Project Overview

Stellar Web is an interactive 3D visualization that creates a dynamic network of animated nodes in three-dimensional space. It produces a "stellar network" effect resembling cosmic or molecular structures, with particles connected by proximity-based edges.

## Tech Stack

- **Three.js v110** - 3D graphics library (loaded via CDN)
- **Vanilla JavaScript (ES6+)** - No framework
- **HTML5/CSS3** - UI structure and styling
- **No build system** - Runs directly in browser

## Project Structure

```
stellar-web/
├── index.html    # Entry point, DOM structure, control sliders
├── script.js     # Core 3D visualization and simulation logic
└── styles.css    # UI styling for controls panel
```

## Running the Project

Open `index.html` directly in a modern browser with WebGL support. No installation or build step required.

## Architecture

### Three.js Scene Hierarchy

```
Scene
├── Nodes[] (THREE.Mesh with SphereGeometry)
└── EdgesGroup (THREE.Group)
    └── Lines[] (THREE.Line with BufferGeometry)
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `createNode()` | Factory for node meshes with random position/velocity |
| `updateNodes()` | Physics simulation - movement and boundary bounce |
| `updateEdges()` | Recalculates connections based on proximity |
| `animate()` | Main render loop via requestAnimationFrame |

### Physics

- Velocity-based linear movement each frame
- Boundary reflection at ±50 units on all axes
- O(n²) proximity check for edge connections

## Interactive Controls

| Control | Range | Default | Purpose |
|---------|-------|---------|---------|
| Node Speed | 0.01-1.0 | 0.2 | Velocity multiplier |
| Connectivity Radius | 5-20 | 10 | Edge distance threshold |
| Node Count | 50-500 | 200 | Total particles |
| Node Size | 0.1-1.0 | 0.2 | Sphere radius |
| Edge Thickness | 0.1-5.0 | 0.5 | Line opacity scaling |

## Code Conventions

- No build tools or package manager
- Minimal inline comments with section markers
- Event-driven updates via slider listeners
- Single global scope for Three.js objects

## Extending the Project

Common enhancements to consider:
- Add color controls for nodes/edges
- Implement different node shapes
- Add gravitational or attraction forces
- Include camera orbit controls
- Add node interaction (hover/click effects)


