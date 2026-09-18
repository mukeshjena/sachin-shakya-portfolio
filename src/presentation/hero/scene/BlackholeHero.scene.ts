// presentation/hero/scene/BlackholeHero.scene.ts
// Pure Three.js scene controller for gravitational blackhole accretion disk.
// Zero React hooks or JSX here per Clean Architecture and Universal Separation of Concerns (Rule 13).

import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import {
  ACCRETION_DISK_FRAGMENT_SHADER,
  ACCRETION_DISK_VERTEX_SHADER,
  EVENT_HORIZON_CORONA_FRAGMENT_SHADER,
  EVENT_HORIZON_CORONA_VERTEX_SHADER,
} from "./BlackholeHero.shaders";

export interface BlackholeSceneOptions {
  readonly isMobile?: boolean;
}

export class BlackholeSceneController {
  private renderer: WebGLRenderer | null = null;
  private scene: Scene | null = null;
  private camera: PerspectiveCamera | null = null;
  private particleMaterial: ShaderMaterial | null = null;
  private coronaMaterial: ShaderMaterial | null = null;
  private animationFrameId: number | null = null;
  private isRunning = false;
  private targetPointerX = 0;
  private targetPointerY = 0;
  private currentPointerX = 0;
  private currentPointerY = 0;
  private clockStart = 0;

  init(canvas: HTMLCanvasElement, options: BlackholeSceneOptions = {}): void {
    const { isMobile = false } = options;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 3.2, 11);
    this.camera.lookAt(0, 0, 0);

    // 2. WebGL Renderer with High Performance
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));

    // 3. Central Event Horizon (Dark Sphere)
    const horizonGeo = new SphereGeometry(1.5, isMobile ? 24 : 48, isMobile ? 24 : 48);
    const horizonMat = new MeshBasicMaterial({ color: 0x06121a });
    const horizonMesh = new Mesh(horizonGeo, horizonMat);
    this.scene.add(horizonMesh);

    // 4. Lensing Corona Atmosphere
    const coronaGeo = new SphereGeometry(1.68, isMobile ? 24 : 48, isMobile ? 24 : 48);
    this.coronaMaterial = new ShaderMaterial({
      vertexShader: EVENT_HORIZON_CORONA_VERTEX_SHADER,
      fragmentShader: EVENT_HORIZON_CORONA_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uCoronaColor: { value: new Color(0xffb020) }, // Primary amber token
        uTime: { value: 0 },
      },
    });
    const coronaMesh = new Mesh(coronaGeo, this.coronaMaterial);
    this.scene.add(coronaMesh);

    // 5. Accretion Disk Particles
    const particleCount = isMobile ? 600 : 1500;
    const geometry = new BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    // Token Palette colors
    const colorAmber = new Color(0xffb020);
    const colorCyan = new Color(0x49c7e8);
    const colorPaper = new Color(0xe8f1f4);

    for (let i = 0; i < particleCount; i++) {
      // Radius distribution: denser near the event horizon
      const radius = 2.0 + Math.random() ** 1.8 * 8.5;
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.55 / Math.sqrt(radius)) * (0.85 + Math.random() * 0.3);

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      radii[i] = radius;
      angles[i] = angle;
      speeds[i] = speed;
      sizes[i] = (1.5 + Math.random() * 2.8) * (radius < 4.0 ? 1.4 : 0.9);

      // Color selection based on distance from core
      const colorChoice = Math.random();
      const chosenColor =
        radius < 3.8
          ? colorChoice > 0.3
            ? colorAmber
            : colorPaper
          : colorChoice > 0.4
            ? colorCyan
            : colorAmber;

      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }

    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new BufferAttribute(sizes, 1));
    geometry.setAttribute("aSpeed", new BufferAttribute(speeds, 1));
    geometry.setAttribute("aAngle", new BufferAttribute(angles, 1));
    geometry.setAttribute("aRadius", new BufferAttribute(radii, 1));
    geometry.setAttribute("aColor", new BufferAttribute(colors, 3));

    this.particleMaterial = new ShaderMaterial({
      vertexShader: ACCRETION_DISK_VERTEX_SHADER,
      fragmentShader: ACCRETION_DISK_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
      },
    });

    const particles = new Points(geometry, this.particleMaterial);
    // Incline disk for realistic celestial angle
    particles.rotation.x = Math.PI * 0.16;
    particles.rotation.z = -Math.PI * 0.04;
    this.scene.add(particles);

    this.clockStart = performance.now();
  }

  setPointer(normalizedX: number, normalizedY: number): void {
    this.targetPointerX = normalizedX;
    this.targetPointerY = normalizedY;
  }

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }

  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resize(width: number, height: number): void {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.uPixelRatio.value = this.renderer.getPixelRatio();
    }
  }

  private tick = (): void => {
    if (!this.isRunning || !this.renderer || !this.scene || !this.camera) return;

    const elapsedTime = (performance.now() - this.clockStart) * 0.001;

    // Update uniform time
    if (this.particleMaterial) {
      this.particleMaterial.uniforms.uTime.value = elapsedTime;
    }
    if (this.coronaMaterial) {
      this.coronaMaterial.uniforms.uTime.value = elapsedTime;
    }

    // Smooth inertia camera tracking based on pointer
    this.currentPointerX += (this.targetPointerX - this.currentPointerX) * 0.05;
    this.currentPointerY += (this.targetPointerY - this.currentPointerY) * 0.05;

    this.camera.position.x = this.currentPointerX * 1.8;
    this.camera.position.y = 3.2 + this.currentPointerY * 0.9;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  dispose(): void {
    this.stop();
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    this.particleMaterial?.dispose();
    this.coronaMaterial?.dispose();
    this.scene = null;
    this.camera = null;
  }
}
