/* Three.js scene: a banana leaf onto which the meal assembles as you scroll.
   Everything is procedural (no model/texture files). Loaded lazily. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PLATE_ITEMS, itemsFor } from './plateItems.js';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOutBack = (t) => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
const rng = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

/* ---------- materials ---------- */
const mk = (o) => new THREE.MeshStandardMaterial(o);
const M = {
  steel: mk({ color: 0xffffff, metalness: 0.85, roughness: 0.3, envMapIntensity: 1.6, side: THREE.DoubleSide }),
  rice: mk({ color: 0xfaf6ea, roughness: 0.95 }),
  grain: mk({ color: 0xfffdf4, roughness: 0.7 }),
  papad: mk({ color: 0xf0d79c, roughness: 0.85 }),
  leafGreen: mk({ color: 0x2f8f3d, roughness: 0.6 }),
  chili: mk({ color: 0xb3201a, roughness: 0.45 }),
  buttermilk: mk({ color: 0xf7f2e6, roughness: 0.3 }),
  chicken: mk({ color: 0x8a4519, roughness: 0.6 }),
  fish: mk({ color: 0xa8421a, roughness: 0.5 }),
  fishDark: mk({ color: 0x6e2a0e, roughness: 0.6 }),
  pickle: mk({ color: 0x5b1a10, roughness: 0.3 }),
  kootu: mk({ color: 0xd9c56a, roughness: 0.8 }),
  seed: mk({ color: 0x2a1d10, roughness: 0.6 }),
};
const liquid = (c) => mk({ color: c, roughness: 0.28 });

const shade = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };

/* ---------- dish builders (all sit on y = 0, centred on x/z = 0) ---------- */
function bowl(r, liquidColor, { garnish = true, seed = 1 } = {}) {
  const g = new THREE.Group();
  const pts = [[0, 0], [.55, 0], [.82, .1], [.98, .5], [1.04, .62], [1.0, .64], [.93, .6], [.78, .18], [0, .12]]
    .map(([x, y]) => new THREE.Vector2(x * r, y * r));
  g.add(shade(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), M.steel)));
  const l = shade(new THREE.Mesh(new THREE.CylinderGeometry(r * 0.9, r * 0.86, 0.05, 40), liquid(liquidColor)));
  l.position.y = r * 0.5; g.add(l);
  if (garnish) {
    const rnd = rng(seed);
    for (let i = 0; i < 4; i++) {
      const leaf = shade(new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), M.leafGreen));
      leaf.scale.set(0.13, 0.025, 0.07);
      const a = rnd() * 6.28, d = rnd() * r * 0.55;
      leaf.position.set(Math.cos(a) * d, r * 0.54, Math.sin(a) * d); leaf.rotation.y = rnd() * 6;
      g.add(leaf);
    }
    const c = shade(new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.25, 3, 6), M.chili));
    c.rotation.set(0, rnd() * 3, Math.PI / 2); c.position.set(r * 0.2, r * 0.56, -r * 0.1); g.add(c);
  }
  return g;
}

function rice(r) {
  const g = new THREE.Group();
  const base = shade(new THREE.Mesh(new THREE.SphereGeometry(r * 0.97, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), M.rice));
  base.scale.y = 0.58; g.add(base);
  const n = 760, rnd = rng(7), d = new THREE.Object3D();
  const grains = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.032, 0.11, 2, 5), M.grain, n);
  for (let i = 0; i < n; i++) {
    const th = rnd() * Math.PI * 2, cy = Math.pow(rnd(), 0.8), sy = Math.sqrt(1 - cy * cy);
    d.position.set(r * sy * Math.cos(th), r * cy * 0.58 * 1.01, r * sy * Math.sin(th));
    d.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
    d.scale.setScalar(0.8 + rnd() * 0.55); d.updateMatrix(); grains.setMatrixAt(i, d.matrix);
  }
  grains.castShadow = true; g.add(grains);
  return g;
}

function cluster(r) {                      // poriyal: a heap of chopped vegetables
  const g = new THREE.Group();
  const n = 90, rnd = rng(11), d = new THREE.Object3D(), col = new THREE.Color();
  const mesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 8, 6), mk({ roughness: 0.55 }), n);
  const pal = [0x4f9a35, 0x77b83a, 0xe6b422, 0xd9822b, 0x3f7f2c];
  for (let i = 0; i < n; i++) {
    const a = rnd() * 6.28, dist = Math.sqrt(rnd()) * r;
    d.position.set(Math.cos(a) * dist, 0.09 + (1 - (dist / r) ** 2) * 0.3 + rnd() * 0.06, Math.sin(a) * dist);
    d.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3);
    d.scale.set(0.8 + rnd() * 0.8, 0.6 + rnd() * 0.5, 0.8 + rnd() * 0.8); d.updateMatrix();
    mesh.setMatrixAt(i, d.matrix); mesh.setColorAt(i, col.setHex(pal[(rnd() * pal.length) | 0]));
  }
  mesh.castShadow = mesh.receiveShadow = true; g.add(mesh);
  return g;
}

function mound(r) {                        // kootu
  const g = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(r, 3), p = geo.attributes.position, rnd = rng(3);
  for (let i = 0; i < p.count; i++) {
    const k = 1 + (Math.sin(p.getX(i) * 6) * Math.cos(p.getZ(i) * 5) * 0.05) + (rnd() - 0.5) * 0.03;
    p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k);
  }
  geo.computeVertexNormals();
  const m = shade(new THREE.Mesh(geo, M.kootu)); m.scale.y = 0.5; g.add(m);
  const seeds = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 6, 4), M.seed, 36), d = new THREE.Object3D();
  for (let i = 0; i < 36; i++) {
    const th = rnd() * 6.28, cy = rnd(), sy = Math.sqrt(1 - cy * cy);
    d.position.set(r * sy * Math.cos(th), r * cy * 0.5 + 0.01, r * sy * Math.sin(th)); d.updateMatrix(); seeds.setMatrixAt(i, d.matrix);
  }
  g.add(seeds);
  return g;
}

function tumbler() {
  const g = new THREE.Group();
  const pts = [[0, 0], [.45, 0], [.52, .05], [.62, 1.3], [.65, 1.33], [.59, 1.3], [.49, .12], [0, .1]].map(([x, y]) => new THREE.Vector2(x, y));
  g.add(shade(new THREE.Mesh(new THREE.LatheGeometry(pts, 36), M.steel)));
  const l = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.5, 0.03, 32), M.buttermilk); l.position.y = 1.08; g.add(l);
  return g;
}

function appalam() {
  const g = new THREE.Group();
  [[0, 0, 0.04, 0.1], [0.55, 0.06, -0.1, -0.12]].forEach(([x, y, z, ry], i) => {
    const m = shade(new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 0.05, 44), M.papad));
    m.position.set(x, 0.03 + y, z); m.rotation.set(0.04 * (i ? -1 : 1), ry, 0.03); g.add(m);
  });
  return g;
}

function fishFry() {
  const g = new THREE.Group();
  const f = shade(new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), M.fish)); f.scale.set(1.25, 0.13, 0.75); f.position.y = 0.12; g.add(f);
  const e = shade(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 8, 16), M.fishDark)); e.rotation.x = Math.PI / 2; e.position.set(-0.15, 0.25, 0); g.add(e);
  return g;
}

function pickle() {
  const g = new THREE.Group();
  const m = shade(new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.pickle)); m.scale.y = 0.55; g.add(m);
  return g;
}

function withPieces(group, r, n, seed) {   // chicken pieces / fish piece in a bowl
  const rnd = rng(seed);
  for (let i = 0; i < n; i++) {
    const p = shade(new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), M.chicken));
    p.scale.set(0.32, 0.2, 0.24); const a = rnd() * 6.28, d = rnd() * r * 0.45;
    p.position.set(Math.cos(a) * d, r * 0.55, Math.sin(a) * d); p.rotation.y = rnd() * 6; group.add(p);
  }
  return group;
}

const BUILD = {
  rice: () => rice(1.35),
  sambar: () => bowl(0.95, 0xd08a1e, { seed: 2 }),
  kuzhambu: () => bowl(0.9, 0x8b3a12, { seed: 4 }),
  poriyal: () => cluster(0.95),
  kootu: () => mound(0.95),
  chicken: () => withPieces(bowl(1.0, 0xb8470f, { seed: 5 }), 1.0, 3, 9),
  fishcurry: () => withPieces(bowl(0.95, 0xc2410c, { seed: 6 }), 0.95, 1, 12),
  fishfry: fishFry,
  rasam: () => bowl(0.85, 0xc4561a, { seed: 8 }),
  moru: tumbler,
  appalam,
  pickle,
};

/* resting place on the leaf (x, z) per mode so the layout always looks plated */
const SPOT = {
  veg: { rice: [0.4, 0.6], sambar: [-3.9, 1.3], kuzhambu: [-3.9, -1.2], poriyal: [-1.6, -2.0], kootu: [1.9, -2.0], rasam: [3.9, 1.2], moru: [4.3, -1.2], appalam: [-1.9, 2.2], pickle: [3.0, 2.4] },
  nonveg: { rice: [0.4, 0.4], chicken: [-3.8, -1.2], fishcurry: [-3.8, 1.4], fishfry: [1.9, -2.0], rasam: [3.9, 1.2], moru: [4.3, -1.2], appalam: [-1.2, 2.3], pickle: [3.0, 2.4] },
};

/* ---------- banana leaf (canvas texture, with cut-out edge) ---------- */
function leafTexture() {
  const W = 1400, H = 820, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.beginPath();
  const edge = (px) => 10 + Math.sin(px * 0.035) * 5 + Math.sin(px * 0.11) * 2;
  x.moveTo(40, edge(40));
  for (let px = 40; px <= W - 40; px += 12) x.lineTo(px, edge(px));
  x.quadraticCurveTo(W - 4, H * 0.5, W - 40, H - edge(W - 40));
  for (let px = W - 40; px >= 40; px -= 12) x.lineTo(px, H - edge(px));
  x.quadraticCurveTo(4, H * 0.5, 40, edge(40));
  x.closePath(); x.save(); x.clip();
  const gr = x.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#1b6a33'); gr.addColorStop(0.5, '#3da25a'); gr.addColorStop(1, '#1b6a33');
  x.fillStyle = gr; x.fillRect(0, 0, W, H);
  x.lineWidth = 1.4;
  for (let px = -300; px < W + 300; px += 7) {                 // parallel veins
    x.strokeStyle = `rgba(255,255,255,${0.035 + ((px * 13) % 7) * 0.006})`;
    x.beginPath(); x.moveTo(px, H / 2); x.quadraticCurveTo(px + 60, H * 0.22, px + 130, 0); x.stroke();
    x.beginPath(); x.moveTo(px, H / 2); x.quadraticCurveTo(px + 60, H * 0.78, px + 130, H); x.stroke();
  }
  const mid = x.createLinearGradient(0, H / 2 - 9, 0, H / 2 + 9);
  mid.addColorStop(0, 'rgba(170,220,140,0)'); mid.addColorStop(0.5, 'rgba(190,230,150,.75)'); mid.addColorStop(1, 'rgba(170,220,140,0)');
  x.fillStyle = mid; x.fillRect(0, H / 2 - 9, W, 18);
  const sh = x.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.6);
  sh.addColorStop(0, 'rgba(255,255,255,.10)'); sh.addColorStop(1, 'rgba(0,0,0,.22)');
  x.fillStyle = sh; x.fillRect(0, 0, W, H);
  x.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

/* ---------- the scene ---------- */
export function createPlateScene(canvas, { instant = false, onStage = () => {}, mode: initialMode = 'veg' } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight(0xfff4dc, 0x4a2e1b, 0.55));
  const sun = new THREE.DirectionalLight(0xfff0d2, 2.4);
  sun.position.set(-4, 11, 5); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 1, far: 30 });
  sun.shadow.radius = 5; sun.shadow.bias = -0.0004; scene.add(sun);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 80);
  const world = new THREE.Group(); scene.add(world);

  const leaf = new THREE.Mesh(new THREE.PlaneGeometry(12, 7).rotateX(-Math.PI / 2),
    new THREE.MeshStandardMaterial({ map: leafTexture(), roughness: 0.5, alphaTest: 0.5, alphaToCoverage: true }));
  leaf.receiveShadow = true; leaf.castShadow = true; leaf.position.y = 0.001; world.add(leaf);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: 0.38 }));
  ground.position.y = -0.35; ground.receiveShadow = true; world.add(ground);
  leaf.position.y = 0.001;

  /* dishes */
  const rnd = rng(42);
  const items = PLATE_ITEMS.map((meta, i) => {
    const group = BUILD[meta.id](); group.visible = false; world.add(group);
    const a = rnd() * Math.PI * 2, R = 10 + rnd() * 6;
    return {
      meta, group, t: 0, desired: 0,
      from: new THREE.Vector3(Math.cos(a) * R, 7 + rnd() * 5, Math.sin(a) * R * 0.7),
      spin: new THREE.Euler((rnd() - 0.5) * 5, (rnd() - 0.5) * 9, (rnd() - 0.5) * 5),
      yaw: (rnd() - 0.5) * 0.6, index: i,
    };
  });

  let mode = initialMode, pTarget = 0, pShown = 0, stageIdx = -2, running = false, raf = 0, last = 0, portrait = false;

  function layout() {
    const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1, asp = w / h;
    renderer.setSize(w, h, false); camera.aspect = asp;
    portrait = asp < 1.15; world.rotation.y = portrait ? Math.PI / 2 : 0;
    const [Wl, Hl] = portrait ? [7.6, 13] : [13, 8];
    const tan = Math.tan((camera.fov * Math.PI) / 360);
    const d = Math.max(Wl / asp, Hl) / (2 * tan) * (portrait ? 1.0 : 1.05);
    camera.userData.base = new THREE.Vector3(0, 0.86, 0.5).normalize().multiplyScalar(d);
    camera.userData.look = new THREE.Vector3(0, 0, portrait ? 0 : 0.2);
    camera.updateProjectionMatrix();
  }

  function setMode(m) { mode = m; stageIdx = -2; }

  function update(dt, time) {
    const k = instant ? 1 : 1 - Math.exp(-dt * 7);
    pShown += (pTarget - pShown) * k;
    const list = itemsFor(mode), N = list.length, seg = 0.8 / N, dur = Math.max(0.13, seg * 1.9);
    let stage = -1;
    items.forEach((it) => {
      const idx = list.indexOf(it.meta);
      it.desired = idx < 0 ? 0 : clamp01((pTarget - (0.05 + idx * seg)) / dur);
      if (idx >= 0 && it.desired > 0.02) stage = Math.max(stage, idx);
      it.t += (it.desired - it.t) * (instant ? 1 : 1 - Math.exp(-dt * 9));
      const g = it.group, t = clamp01(it.t);
      if (t < 0.003) { g.visible = false; return; }
      g.visible = true;
      const spot = SPOT[mode][it.meta.id] || SPOT.veg[it.meta.id] || [0, 0];
      const e = 1 - Math.pow(1 - t, 3);
      g.position.set(lerp(it.from.x, spot[0], e), lerp(it.from.y, 0, e) + Math.sin(Math.PI * t) * 1.6, lerp(it.from.z, spot[1], e));
      g.rotation.set(it.spin.x * (1 - e), it.spin.y * (1 - e) + it.yaw * e, it.spin.z * (1 - e));
      g.scale.setScalar(0.25 + 0.75 * easeOutBack(t));
    });
    if (stage !== stageIdx) { stageIdx = stage; onStage({ index: stage, total: N, id: stage >= 0 ? list[stage].id : null }); }

    const intro = clamp01(pShown / 0.05);
    leaf.scale.setScalar(0.85 + 0.15 * intro);
    const sway = Math.sin(pShown * Math.PI) * (portrait ? 0.3 : 0.9) + Math.sin(time * 0.4) * 0.12;
    camera.position.copy(camera.userData.base); camera.position.x += sway; camera.position.y += (1 - pShown) * 0.8;
    camera.lookAt(camera.userData.look);
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    update(dt, now / 1000); renderer.render(scene, camera); raf = requestAnimationFrame(frame);
  }
  const renderOnce = () => { update(0.016, performance.now() / 1000); renderer.render(scene, camera); };

  const ro = new ResizeObserver(() => { layout(); if (!running) renderOnce(); });
  ro.observe(canvas); layout();

  const onVis = () => { if (document.hidden) stopLoop(); else if (wantRun) startLoop(); };
  let wantRun = false;
  function startLoop() { if (running || instant) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  document.addEventListener('visibilitychange', onVis);

  renderOnce();
  return {
    setProgress(p) { pTarget = clamp01(p); if (instant || !running) { if (instant) pShown = pTarget; renderOnce(); } },
    setMode(m) { setMode(m); if (!running) renderOnce(); },
    setActive(on) { wantRun = on; if (on && !document.hidden) startLoop(); else stopLoop(); },
    dispose() {
      stopLoop(); ro.disconnect(); document.removeEventListener('visibilitychange', onVis);
      scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
      Object.values(M).forEach((m) => m.dispose()); pmrem.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
