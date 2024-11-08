import "./App.css";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a scene
    const scene = new THREE.Scene();

    // Create a 3D sheet by using BoxGeometry with a very small thickness
    const sheetGeometry = new THREE.BoxGeometry(1, 15, 15); // Thin in depth to simulate a sheet
    const sheetMaterial = new THREE.MeshPhongMaterial({
      color: "#2E9DD1",
      shininess: 100,
      emissive: "#bababa",
    });
    const sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);
    scene.add(sheet);

    // Rotate the sheet to face the camera initially
    sheet.rotation.y = Math.PI / 2; // Rotate to make the flat side face the camera

    // Set up camera to face the sheet directly
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    camera.lookAt(sheet.position);

    // Add a directional light
    const pointLight = new THREE.DirectionalLight("#f2f2f2", 10);
    pointLight.position.set(5, 5, 0);
    scene.add(pointLight);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight("#f2f2f2");
    scene.add(ambientLight);

    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Set up controls with OrbitControls, linking to the renderer's DOM element
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Animation loop
    function animate() {
      sheet.rotation.y += 0.01;
      controls.update();

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    function handleResize() {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      renderer.dispose();
      controls.dispose(); // Properly dispose controls
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
