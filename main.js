import * as THREE from "three";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

let camera, scene, renderer, controls;

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    20
  );
  camera.position.set(-0.75, 0.7, 1.25);

  scene = new THREE.Scene();

  // model

  new GLTFLoader().setPath("../models/").load("SheenChair.glb", function (gltf) {
    scene.add(gltf.scene);

    const object = gltf.scene.getObjectByName("SheenChair_fabric");

    const backgroundColor = "transparent"; // Background color
    const textColor = "black"; // Text color

    const textTexture = createTextTexture(
      "About Me",
      backgroundColor,
      textColor
    ); // Function to create text texture
    const textMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
    });
    const textGeometry = new THREE.PlaneGeometry(0.3, 0.1); // Adjust size as needed
    textGeometry.rotateZ(2 * Math.PI);
    textGeometry.rotateY(Math.PI);
    textGeometry.rotateX(2 * Math.PI);
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 0.555, -0.26); // Position the text on the chair
    scene.add(textMesh);

    // Function to create text texture
    function createTextTexture(text, backgroundColor, textColor) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const fontSize = 10;
      const padding = 5;

      // Measure text width and height
      context.font = `${fontSize}`;
      const textMetrics = context.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      // Calculate canvas size based on text size and padding
      const canvasWidth = textWidth + padding * 2;
      const canvasHeight = textHeight + padding * 2;

      // Set canvas size
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw background
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvasWidth, canvasHeight);

      // Draw text
      context.font = `${fontSize}px`;
      context.fillStyle = textColor;
      context.fillText(text, padding, padding + fontSize);

      // Create texture
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      return texture;
    }
    // Define raycaster and mouse vector
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    // Set up mouse events
    function onMouseClick(event) {
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Cast a ray from the camera through the mouse position
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      var intersects = raycaster.intersectObject(textMesh, true);

      // If there is an intersection, handle it
      if (intersects.length > 0) {
        console.log("Text clicked!");
        window.location.href = "/"; // Adjust the link accordingly
      }
    }

    function onMouseMove(event) {
      // Update mouse position
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    // Add event listeners
    window.addEventListener("click", onMouseClick, false);
    window.addEventListener("mousemove", onMouseMove, false);
  });

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.domElement.style.pointerEvents = "auto";
  container.appendChild(renderer.domElement);
  displayInformation();

  const environment = new RoomEnvironment(renderer);
  const pmremGenerator = new THREE.PMREMGenerator(renderer);

  scene.background = new THREE.Color(0xbbbbbb);
  scene.environment = pmremGenerator.fromScene(environment).texture;

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 10;
  controls.target.set(0, 0.35, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function displayInformation() {
  // Add code to display information in the scene
  const infoText = document.createElement("div");
  infoText.style.position = "absolute";
  infoText.style.width = 200 + "px";
  infoText.style.height = 100 + "px";
  infoText.style.color = "white";
  infoText.style.backgroundColor = "0xbbbbbb";
  infoText.style.top = 50 + "px";
  infoText.style.left = 50 + "px";
  infoText.innerHTML =
    "Great discoveries await those who dare to look beneath the surface, even if it means peeking under the chair.";
  document.body.appendChild(infoText);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // required if damping enabled

  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();
