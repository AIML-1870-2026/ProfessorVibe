// Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Node and Edge Settings
let nodeCount = 200; // Default node count
let nodeSize = 0.2; // Default node size
let proximityThreshold = 10; // Default connectivity radius
let nodeSpeedMultiplier = 0.2; // Default speed
let edgeThickness = 0.5; // Default edge thickness

// DOM Elements for Sliders
const speedSlider = document.getElementById('speedSlider');
const radiusSlider = document.getElementById('radiusSlider');
const countSlider = document.getElementById('countSlider');
const sizeSlider = document.getElementById('sizeSlider');
const thicknessSlider = document.getElementById('thicknessSlider');

speedSlider.addEventListener('input', () => {
  nodeSpeedMultiplier = parseFloat(speedSlider.value);
});

radiusSlider.addEventListener('input', () => {
  proximityThreshold = parseFloat(radiusSlider.value);
});

countSlider.addEventListener('input', () => {
  nodeCount = parseInt(countSlider.value);
  resetNodes();
});

sizeSlider.addEventListener('input', () => {
  nodeSize = parseFloat(sizeSlider.value);
  updateNodeSize();
});

thicknessSlider.addEventListener('input', () => {
  edgeThickness = parseFloat(thicknessSlider.value);
});

// Nodes and edges
let nodes = [];
const edgesGroup = new THREE.Group();
scene.add(edgesGroup);

function createNode() {
  const nodeGeometry = new THREE.SphereGeometry(nodeSize, 8, 8);
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
  node.position.set(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );
  return {
    mesh: node,
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * nodeSpeedMultiplier,
      (Math.random() - 0.5) * nodeSpeedMultiplier,
      (Math.random() - 0.5) * nodeSpeedMultiplier
    )
  };
}

function resetNodes() {
  // Remove existing nodes
  nodes.forEach(node => scene.remove(node.mesh));
  nodes = [];

  // Add new nodes
  for (let i = 0; i < nodeCount; i++) {
    const node = createNode();
    nodes.push(node);
    scene.add(node.mesh);
  }
}

function updateNodeSize() {
  nodes.forEach(node => {
    node.mesh.geometry.dispose();
    node.mesh.geometry = new THREE.SphereGeometry(nodeSize, 8, 8);
  });
}

function updateEdges() {
  while (edgesGroup.children.length > 0) {
    edgesGroup.remove(edgesGroup.children[0]);
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = nodes[i].mesh.position.distanceTo(nodes[j].mesh.position);
      if (distance < proximityThreshold) {
        const opacity = (1 - distance / proximityThreshold) * edgeThickness;

        const edgeMaterial = new THREE.LineBasicMaterial({
          color: 0x0000ff,
          transparent: true,
          opacity: opacity
        });

        const edgeGeometry = new THREE.BufferGeometry().setFromPoints([
          nodes[i].mesh.position,
          nodes[j].mesh.position
        ]);
        const edge = new THREE.Line(edgeGeometry, edgeMaterial);
        edgesGroup.add(edge);
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);

  nodes.forEach(node => {
    node.mesh.position.addScaledVector(node.velocity, nodeSpeedMultiplier);

    ['x', 'y', 'z'].forEach(axis => {
      if (Math.abs(node.mesh.position[axis]) > 50) {
        node.velocity[axis] *= -1;
      }
    });
  });

  updateEdges();
  renderer.render(scene, camera);
}

resetNodes();
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
