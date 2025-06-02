import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// === Escena y cámara ===
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); // Fondo oscuro para depuración

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 2, 5);

// === Renderizador ===
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// === Controles de órbita ===
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// === Luces ===
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7);
scene.add(dirLight);

// === Helpers (para depurar) ===
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const lightHelper = new THREE.DirectionalLightHelper(dirLight);
scene.add(lightHelper);

// === Carga de modelos ===
const loader = new GLTFLoader();

let modelA, modelB;

loader.load("/bandera.glb", (gltf) => {
  modelA = gltf.scene;
  modelA.scale.set(2, 2, 2); // Aumenta tamaño
  modelA.position.set(0, 0, 0);
  modelA.visible = false;
  scene.add(modelA);
  console.log("Modelo bandera.glb cargado");
});

loader.load(
  "/2.glb",
  (gltf) => {
    modelB = gltf.scene;
    modelB.scale.set(2, 2, 2);
    modelB.position.set(0, 0, 0);
    modelB.visible = false;
    scene.add(modelB);
    console.log("Modelo 2.glb cargado");
  },
  undefined,
  (error) => {
    console.error("Error cargando 2.glb:", error);
  },
);

// === Cambiar modelo visible según el scroll ===
let currentSection = -1;

function updateScene(index) {
  if (currentSection === index) return;
  currentSection = index;

  if (modelA) modelA.visible = index === 0;
  if (modelB) modelB.visible = index === 2;

  console.log("Escena activa:", index);
}

function checkScroll() {
  const sections = document.querySelectorAll(".page");
  const scrollPos = window.scrollY + window.innerHeight / 2;

  let newSection = currentSection;

  sections.forEach((section, index) => {
    const { top, bottom } = section.getBoundingClientRect();
    const offsetTop = window.scrollY + top;
    const offsetBottom = window.scrollY + bottom;

    if (scrollPos >= offsetTop && scrollPos < offsetBottom) {
      newSection = index;
    }
  });

  if (newSection !== currentSection) {
    updateScene(newSection);
  }
}

// === Animación ===
function animate() {
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// === Eventos ===
window.addEventListener("scroll", checkScroll);
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
checkScroll(); // Inicializa visibilidad al cargar
