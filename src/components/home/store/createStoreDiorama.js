import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
const C = {
  navy: '#243849',
  orange: '#cf6947',
  cream: '#eee8dc',
  white: '#faf9f5',
  wood: '#c5a482',
  teal: '#548b87',
  yellow: '#d7ae58',
  pavement: '#e9eceb',
  skin: '#c99470',
  hair: '#443b36',
  green: '#7f9677',
  glass: '#c5dedf',
};
const clamp = THREE.MathUtils.clamp;
const segment = (p, start, end) => clamp((p - start) / (end - start), 0, 1);
const ease = (p) => p * p * (3 - 2 * p);
/** A matte, modelled scene. Every door and character pose is a function of scroll. */
export function createStoreDiorama(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0xffffff, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-5, 5, 3.4, -3.4, 0.1, 60);
  camera.position.set(7.8, 6.2, 13);
  camera.lookAt(0, 1.4, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd2cbbd, 2.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.5);
  sun.position.set(-3, 8, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -7;
  sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.normalBias = 0.04;
  sun.shadow.bias = -0.0002;
  sun.shadow.radius = 4;
  scene.add(sun);
  const materials = new Map();
  const geometries = new Set();
  const textures = [];
  const material = (color) => {
    if (!materials.has(color))
      materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: 0.92 }));
    return materials.get(color);
  };
  function mesh(parent, geometry, color, x, y, z) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, material(color));
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = true;
    parent.add(object);
    return object;
  }
  function box(parent, w, h, d, x, y, z, color, radius = 0.025) {
    return mesh(
      parent,
      new RoundedBoxGeometry(w, h, d, 2, Math.min(radius, w / 4, h / 4, d / 4)),
      color,
      x,
      y,
      z,
    );
  }
  function sphere(parent, radius, x, y, z, color) {
    return mesh(parent, new THREE.SphereGeometry(radius, 16, 12), color, x, y, z);
  }
  function cylinder(parent, top, bottom, h, x, y, z, color) {
    return mesh(parent, new THREE.CylinderGeometry(top, bottom, h, 20), color, x, y, z);
  }
  function group(parent, x, y, z) {
    const object = new THREE.Group();
    object.position.set(x, y, z);
    parent.add(object);
    return object;
  }
  function label(parent, text, w, h, x, y, z, background, ink, size = 90) {
    const surface = document.createElement('canvas');
    surface.width = 1024;
    surface.height = 256;
    const ctx = surface.getContext('2d');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, 1024, 256);
    ctx.fillStyle = ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${size}px 'Nunito Variable', sans-serif`;
    ctx.fillText(text, 512, 134);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.push(texture);
    const geometry = new THREE.PlaneGeometry(w, h);
    geometries.add(geometry);
    const face = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    face.position.set(x, y, z);
    parent.add(face);
    return face;
  }
  const shop = group(scene, 0, 0, 0);
  // A small pavement island grounds the model without a photo backdrop.
  box(shop, 8.3, 0.16, 5.8, 0, -0.15, 0.1, C.pavement, 0.12);
  box(shop, 6.0, 0.13, 3.0, 0, -0.025, -1.05, C.cream);
  box(shop, 5.8, 3.4, 0.16, 0, 1.7, -2.4, C.cream);
  box(shop, 0.18, 3.4, 2.4, -2.9, 1.7, -1.2, C.cream);
  box(shop, 0.18, 3.4, 2.4, 2.9, 1.7, -1.2, C.cream);
  // Front columns and lintel leave a real opening for the entrance.
  box(shop, 0.3, 3.3, 0.25, -2.8, 1.65, 0, C.cream);
  box(shop, 0.35, 3.3, 0.25, 0.48, 1.65, 0, C.cream);
  box(shop, 0.75, 3.3, 0.25, 2.56, 1.65, 0, C.cream);
  box(shop, 5.85, 0.8, 0.3, 0, 3.0, 0, C.cream);
  box(shop, 3.0, 0.5, 0.24, -1.18, 0.25, 0, C.cream);
  box(shop, 6.08, 0.2, 2.7, 0, 3.5, -1.13, C.white, 0.035);
  box(shop, 5.5, 0.48, 0.08, 0, 3.12, 0.2, C.navy);
  label(shop, 'E D V I N', 3.8, 0.45, 0, 3.12, 0.246, C.navy, C.white, 155);
  // Restrained orange fabric canopy, with separate strips and a sewn valance.
  for (let i = 0; i < 14; i++) {
    const x = -2.6 + i * 0.4;
    const color = i % 2 === 0 ? C.orange : C.white;
    const canopy = box(shop, 0.405, 0.07, 0.9, x, 2.73, 0.36, color, 0.014);
    canopy.rotation.x = 0.18;
    box(shop, 0.405, 0.19, 0.065, x, 2.57, 0.8, color, 0.025);
  }
  // Shop window: frame, sill, shelves and gently tinted glazing.
  const windowX = -1.2;
  box(shop, 3.05, 0.1, 0.14, windowX, 0.57, 0.1, C.navy);
  box(shop, 0.08, 2.0, 0.12, -2.67, 1.55, 0.1, C.navy);
  box(shop, 0.08, 2.0, 0.12, 0.28, 1.55, 0.1, C.navy);
  box(shop, 0.055, 2.0, 0.1, -1.2, 1.55, 0.1, C.navy);
  box(shop, 3.25, 0.12, 0.45, windowX, 0.48, 0.15, C.wood);
  for (const y of [0.66, 1.37, 2.08]) box(shop, 2.88, 0.075, 0.7, windowX, y, -0.37, C.wood);
  const glazingMaterial = new THREE.MeshBasicMaterial({
    color: C.glass,
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
  });
  const glazingGeometry = new THREE.PlaneGeometry(2.9, 1.85);
  geometries.add(glazingGeometry);
  const glazing = new THREE.Mesh(glazingGeometry, glazingMaterial);
  glazing.position.set(-1.2, 1.52, 0.12);
  shop.add(glazing);
  // Back-of-store shelves visible through the doorway.
  for (const y of [0.55, 1.25, 1.95]) {
    box(shop, 5.3, 0.07, 0.45, 0, y, -2.03, C.wood);
    for (let i = 0; i < 10; i++)
      box(
        shop,
        0.25,
        0.3 + (i % 3) * 0.07,
        0.24,
        -2.35 + i * 0.52,
        y + 0.22,
        -2,
        [C.teal, C.orange, C.yellow, C.cream][i % 4],
      );
  }
  function teddy(parent, x, y, z, size = 1) {
    const toy = group(parent, x, y, z);
    toy.scale.setScalar(size);
    sphere(toy, 0.21, 0, 0.23, 0, C.wood).scale.set(0.9, 1, 0.75);
    sphere(toy, 0.17, 0, 0.53, 0, C.wood);
    sphere(toy, 0.073, -0.13, 0.66, 0, C.wood);
    sphere(toy, 0.073, 0.13, 0.66, 0, C.wood);
    sphere(toy, 0.09, -0.15, 0.08, 0.08, C.wood);
    sphere(toy, 0.09, 0.15, 0.08, 0.08, C.wood);
    sphere(toy, 0.08, 0, 0.49, 0.15, C.cream).scale.set(1, 0.8, 0.65);
    sphere(toy, 0.022, 0, 0.51, 0.2, C.navy);
    for (const xEye of [-0.065, 0.065]) sphere(toy, 0.013, xEye, 0.57, 0.15, C.navy);
    return toy;
  }
  teddy(shop, -2.14, 0.73, -0.23, 0.75);
  teddy(shop, -1.63, 0.73, -0.23, 0.65);
  teddy(shop, -0.32, 1.43, -0.24, 0.75);
  for (let i = 0; i < 3; i++) {
    box(
      shop,
      0.34,
      0.32,
      0.31,
      -0.75 + (i % 2) * 0.36,
      0.88 + Math.floor(i / 2) * 0.32,
      -0.25,
      [C.orange, C.teal, C.yellow][i],
    );
    cylinder(
      shop,
      0.15 - i * 0.025,
      0.15 - i * 0.025,
      0.1,
      -2.15,
      1.5 + i * 0.11,
      -0.25,
      [C.teal, C.yellow, C.orange][i],
    );
  }
  for (const x of [-1.42, -0.78]) {
    box(shop, 0.43, 0.17, 0.22, x, 2.25, -0.25, x < -1 ? C.orange : C.teal, 0.05);
    for (const offset of [-0.14, 0.14]) {
      const wheel = cylinder(shop, 0.065, 0.065, 0.25, x + offset, 2.2, -0.25, C.navy);
      wheel.rotation.x = Math.PI / 2;
    }
  }
  // Hinged door. It swings out to clear the visitors' path through the opening.
  const doorHinge = group(shop, 2.15, 0, 0.12);
  const doorW = 1.43;
  box(doorHinge, 0.09, 2.55, 0.1, -doorW, 1.275, 0, C.navy);
  box(doorHinge, 0.09, 2.55, 0.1, 0, 1.275, 0, C.navy);
  for (const y of [0.08, 0.65, 2.5]) box(doorHinge, doorW, 0.1, 0.1, -doorW / 2, y, 0, C.navy);
  box(doorHinge, doorW, 0.58, 0.08, -doorW / 2, 0.34, 0, C.navy);
  const doorPaneGeometry = new THREE.BoxGeometry(doorW - 0.08, 1.75, 0.025);
  geometries.add(doorPaneGeometry);
  const doorGlassMaterial = new THREE.MeshStandardMaterial({
    color: C.glass,
    transparent: true,
    opacity: 0.28,
    roughness: 0.6,
    depthWrite: false,
  });
  const doorPane = new THREE.Mesh(doorPaneGeometry, doorGlassMaterial);
  doorPane.position.set(-doorW / 2, 1.57, 0);
  doorHinge.add(doorPane);
  box(doorHinge, 0.045, 0.25, 0.07, -doorW + 0.19, 1.25, 0.09, C.wood);
  box(shop, 1.6, 0.055, 0.07, 1.43, 2.6, 0.07, C.navy);
  box(shop, 1.52, 0.04, 0.6, 1.43, 0.01, 0.2, C.wood);
  // A small open/closed sign hangs from the door and turns with it.
  label(doorHinge, 'COME IN', 0.68, 0.17, -0.72, 1.93, 0.07, C.white, C.navy, 125);
  // Familiar street details are modelled, rather than baked into a glowing image.
  const bench = group(shop, -2.3, 0, 1.1);
  for (const z of [-0.1, 0.03, 0.16]) box(bench, 1.15, 0.07, 0.11, 0, 0.4, z, C.wood);
  for (const x of [-0.45, 0.45]) box(bench, 0.07, 0.4, 0.32, x, 0.18, 0.04, C.navy);
  for (const y of [0.65, 0.79]) box(bench, 1.15, 0.1, 0.06, 0, y, -0.12, C.wood);
  for (const x of [-0.45, 0.45]) box(bench, 0.05, 0.5, 0.055, x, 0.59, -0.14, C.navy);
  function plant(x, z, scale = 1) {
    const pot = group(shop, x, 0, z);
    pot.scale.setScalar(scale);
    cylinder(pot, 0.24, 0.18, 0.4, 0, 0.2, 0, C.orange);
    cylinder(pot, 0.04, 0.04, 0.75, 0, 0.67, 0, C.wood);
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4;
      sphere(
        pot,
        0.22,
        Math.sin(angle) * 0.13,
        0.9 + (i % 3) * 0.16,
        Math.cos(angle) * 0.13,
        C.green,
      ).scale.set(0.8, 1.2, 0.8);
    }
  }
  plant(3.25, 0.48);
  plant(-3.18, -0.05, 0.78);
  for (let i = 0; i < 2; i++) {
    const parcel = group(shop, 2.74 + i * 0.43, 0.21, 1.14 + i * 0.19);
    box(parcel, 0.42, 0.4, 0.4, 0, 0, 0, C.wood);
    box(parcel, 0.08, 0.405, 0.405, 0, 0, 0, C.cream, 0.005);
  }
  function person(color, scale, skin, hair) {
    const root = group(shop, 0, 0, 0);
    root.scale.setScalar(scale);
    const body = group(root, 0, 0, 0);
    const torso = mesh(body, new THREE.CapsuleGeometry(0.19, 0.32, 5, 12), color, 0, 0.99, 0);
    torso.scale.z = 0.75;
    cylinder(body, 0.07, 0.07, 0.1, 0, 1.34, 0, skin);
    sphere(body, 0.195, 0, 1.56, 0, skin).scale.set(0.88, 1.1, 0.9);
    const hairMesh = sphere(body, 0.2, 0, 1.66, -0.02, hair);
    hairMesh.scale.set(0.9, 0.64, 0.91);
    for (const x of [-0.065, 0.065]) sphere(body, 0.012, x, 1.57, 0.157, C.navy);
    sphere(body, 0.025, 0, 1.52, 0.18, skin);
    const legs = [];
    const arms = [];
    for (const side of [-1, 1]) {
      const leg = group(body, side * 0.105, 0.75, 0);
      mesh(leg, new THREE.CapsuleGeometry(0.078, 0.45, 4, 10), C.navy, 0, -0.29, 0);
      box(leg, 0.16, 0.1, 0.29, 0, -0.65, 0.055, C.white, 0.045);
      legs.push(leg);
      const arm = group(body, side * 0.235, 1.19, 0);
      mesh(arm, new THREE.CapsuleGeometry(0.07, 0.28, 4, 10), color, 0, -0.16, 0);
      sphere(arm, 0.068, 0, -0.37, 0, skin);
      arms.push(arm);
    }
    return { root, body, legs, arms };
  }
  const adult = person(C.teal, 0.91, C.skin, C.hair);
  const child = person(C.yellow, 0.63, '#dca985', '#65483a');
  // The shopkeeper is visible inside and gives a small greeting as the door opens.
  const keeper = person(C.orange, 0.86, '#ddb08e', '#544940');
  keeper.root.position.set(0.95, 0, -1.66);
  keeper.arms[1].rotation.z = -2.4;
  const parentPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.25, 0, 2.15),
    new THREE.Vector3(-0.45, 0, 2.13),
    new THREE.Vector3(1.35, 0, 1.1),
    new THREE.Vector3(1.35, 0, -1.42),
  ]);
  const childPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.6, 0, 2.55),
    new THREE.Vector3(0.1, 0, 2.5),
    new THREE.Vector3(1.38, 0, 1.22),
    new THREE.Vector3(1.38, 0, -1.25),
  ]);
  function walk(character, path, t) {
    const location = path.getPointAt(t);
    const tangent = path.getTangentAt(t);
    character.root.position.copy(location);
    character.root.rotation.y = Math.atan2(tangent.x, tangent.z);
    const stride = Math.sin(t * Math.PI * 17) * (t > 0 && t < 1 ? 0.48 : 0);
    character.legs[0].rotation.x = stride;
    character.legs[1].rotation.x = -stride;
    character.arms[0].rotation.x = -stride * 0.75;
    character.arms[1].rotation.x = stride * 0.75;
    character.body.position.y = Math.abs(Math.sin(t * Math.PI * 17)) * (t > 0 && t < 1 ? 0.035 : 0);
    character.root.visible = t < 0.995;
  }
  const draw = (p) => {
    const open = ease(segment(p, 0.08, 0.3)) * (1 - ease(segment(p, 0.84, 0.99)));
    doorHinge.rotation.y = open * 1.48;
    walk(adult, parentPath, segment(p, 0.28, 0.75));
    walk(child, childPath, segment(p, 0.34, 0.83));
    keeper.arms[1].rotation.z = -2.3 + Math.sin(segment(p, 0.1, 0.7) * Math.PI * 6) * 0.2;
    renderer.render(scene, camera);
  };
  const resize = (width, height) => {
    renderer.setSize(width, height, false);
    const aspect = width / height;
    const viewHeight = Math.max(5.85, 10.3 / aspect);
    camera.left = (-viewHeight * aspect) / 2;
    camera.right = (viewHeight * aspect) / 2;
    camera.top = viewHeight / 2;
    camera.bottom = -viewHeight / 2;
    camera.updateProjectionMatrix();
  };
  const dispose = () => {
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((m) => m.dispose());
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh && !Array.from(materials.values()).includes(object.material)) {
        const mats = Array.isArray(object.material) ? object.material : [object.material];
        mats.forEach((m) => m.dispose());
      }
    });
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
  };
  return { draw, resize, dispose };
}
