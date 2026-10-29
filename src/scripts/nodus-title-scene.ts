import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  ShadowMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SpotLight,
  Vector3,
  WebGLRenderer,
} from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import fontData from "@/assets/fonts/helvetiker_bold.typeface.json";

export function createTitleScene(host: HTMLElement, signal: AbortSignal) {
  const canvas = host.querySelector<HTMLCanvasElement>("canvas")!;
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setClearColor(0x080b0e, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  const environmentScene = new RoomEnvironment();
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentScene, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  environmentScene.dispose();
  pmrem.dispose();
  const font = new FontLoader().parse(fontData);
  const front = new MeshStandardMaterial({
    color: 0xdfe6e9,
    metalness: 0.88,
    roughness: 0.23,
    envMapIntensity: 0.85,
  });
  const edge = new MeshStandardMaterial({
    color: 0x606f7b,
    metalness: 0.84,
    roughness: 0.3,
    envMapIntensity: 0.8,
  });
  const highlight = new MeshStandardMaterial({
    color: 0x64e6bc,
    metalness: 0.65,
    roughness: 0.22,
    emissive: 0x167850,
    emissiveIntensity: 0.38,
    envMapIntensity: 0.9,
  });
  const group = new Group();
  scene.add(group);
  const meshes = ["Project", "N", "odus"].map((word, index) => {
    const geometry = new TextGeometry(word, {
      font,
      size: 1.65,
      depth: 0.32,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.025,
      bevelSegments: 3,
    });
    geometry.computeBoundingBox();
    const mesh = new Mesh(geometry, [index === 1 ? highlight : front, edge]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  });
  meshes[0].geometry.center();
  const nodus = new Group();
  meshes[2].position.x = (font.data.glyphs.N.ha * 1.65) / font.data.resolution;
  nodus.add(meshes[1], meshes[2]);
  const wordCenter = new Box3().setFromObject(nodus).getCenter(new Vector3());
  meshes[1].position.sub(wordCenter);
  meshes[2].position.sub(wordCenter);
  group.add(meshes[0], nodus);
  scene.add(new AmbientLight(0xdde6ed, 0.42));
  const key = new SpotLight(0xf2f5ff, 400, 45, 0.65, 0.9, 2);
  key.position.set(-4, 7, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.bias = -0.0002;
  key.shadow.normalBias = 0.025;
  key.shadow.blurSamples = 12;
  scene.add(key, key.target);
  const rim = new SpotLight(0xdde6ed, 230, 35, 0.8, 1, 2);
  rim.position.set(7, 3, -2);
  scene.add(rim, rim.target);
  const fill = new DirectionalLight(0xffffff, 2.4);
  fill.position.set(-2, 1, 7);
  scene.add(fill);
  const floorMaterial = new ShadowMaterial({ color: 0x000000, opacity: 0.32 });
  const floor = new Mesh(new PlaneGeometry(80, 80), floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let paused =
    reduced.matches ||
    host.closest<HTMLElement>("[data-nodus-home]")?.dataset.motion === "paused";
  let visible = true;
  let frame = 0;
  let lastRender = 0;
  let mobile = false;
  const pointer = { x: 0, y: 0 };
  const center = new Vector3();
  const size = new Vector3();
  const layout = () => {
    const { width, height } = host.getBoundingClientRect();
    mobile = width < 640;
    meshes[0].scale.setScalar(mobile ? 0.52 : 0.62);
    meshes[0].position.set(0, 1.3, 0);
    nodus.position.set(0, -0.4, 0);
    group.rotation.set(0, 0, 0);
    group.position.y = 0;
    const bounds = new Box3().setFromObject(group);
    bounds.getSize(size);
    bounds.getCenter(center);
    camera.aspect = width / height;
    const tangent = Math.tan((camera.fov * Math.PI) / 360);
    const distance = Math.max(
      (size.x / (2 * tangent * camera.aspect)) * 1.14,
      (size.y / (2 * tangent)) * 1.4
    );
    camera.position.set(0, mobile ? 0.75 : 0.65, distance);
    camera.lookAt(0, center.y - 0.08, 0);
    camera.updateProjectionMatrix();
    floor.position.y = bounds.min.y - 0.32;
    renderer.setSize(width, height, false);
    render(performance.now());
  };
  const render = (now: number) => {
    const time = now * 0.00032;
    group.rotation.x += (-0.055 + pointer.y * 0.035 - group.rotation.x) * 0.06;
    group.rotation.y += (-0.055 + pointer.x * 0.075 - group.rotation.y) * 0.06;
    group.position.y = paused ? 0 : Math.sin(time) * 0.04;
    key.position.x = -4 + (paused ? 0 : Math.sin(time * 0.7) * 0.5);
    renderer.render(scene, camera);
  };
  const tick = (now: number) => {
    frame = 0;
    if (document.hidden || !visible || signal.aborted || paused) return;
    if (now - lastRender > 32) {
      render(now);
      lastRender = now;
    }
    frame = requestAnimationFrame(tick);
  };
  const schedule = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    render(performance.now());
    if (!paused && !document.hidden && visible && !signal.aborted)
      frame = requestAnimationFrame(tick);
  };
  host.addEventListener(
    "pointermove",
    event => {
      if (paused || event.pointerType !== "mouse") return;
      const bounds = host.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    },
    { signal }
  );
  host.addEventListener(
    "pointerleave",
    () => {
      pointer.x = 0;
      pointer.y = 0;
    },
    { signal }
  );
  window.addEventListener(
    "nodus:motion",
    event => {
      paused =
        (event as CustomEvent<{ paused: boolean }>).detail.paused ||
        reduced.matches;
      schedule();
    },
    { signal }
  );
  reduced.addEventListener(
    "change",
    () => {
      paused = reduced.matches;
      schedule();
    },
    { signal }
  );
  document.addEventListener("visibilitychange", schedule, { signal });
  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  });
  observer.observe(host);
  const resize = new ResizeObserver(layout);
  resize.observe(host);
  layout();
  host.dataset.ready = "";
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    resize.disconnect();
    meshes.forEach(mesh => mesh.geometry.dispose());
    front.dispose();
    highlight.dispose();
    edge.dispose();
    floor.geometry.dispose();
    floorMaterial.dispose();
    key.shadow.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
