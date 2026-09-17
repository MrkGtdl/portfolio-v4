"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const MAX_PARTICLES = 14000;

function ParticleModel({ progress = 0 }) {
  const pointsRef = useRef();
  const ambientRef = useRef();
  const modelGroupRef = useRef();
  const solidGroupRef = useRef();

  // =========================
  // HEAD TRACKING
  // =========================

  const mouseRef = useRef({
    x: 0,
    y: 0,
  });

  const headRotationRef = useRef({
    x: 0,
    y: 0,
  });

  const { scene } = useGLTF("/models/untitled-6.glb");

  // =========================
  // MOUSE
  // =========================

  useMemo(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;

      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // =========================
  // PARTICLE DATA
  // =========================

  const particleData = useMemo(() => {
    const meshes = [];

    scene.updateMatrixWorld(true);

    scene.traverse((object) => {
      if (!object.isMesh || !object.geometry) return;

      const position = object.geometry.attributes.position;

      if (!position || position.count === 0) return;

      meshes.push({
        object,
        position,
        count: position.count,
        material: object.material,
      });
    });

    if (!meshes.length) return null;

    const totalVertices = meshes.reduce((sum, mesh) => sum + mesh.count, 0);

    const targets = [];
    const targetColors = [];

    meshes.forEach((mesh) => {
      const particleCount = Math.max(
        1,
        Math.round((mesh.count / totalVertices) * MAX_PARTICLES),
      );

      const matrix = mesh.object.matrixWorld;

      for (let i = 0; i < particleCount; i++) {
        const index = Math.floor(Math.random() * mesh.count);

        const vertex = new THREE.Vector3(
          mesh.position.getX(index),
          mesh.position.getY(index),
          mesh.position.getZ(index),
        );

        vertex.applyMatrix4(matrix);

        targets.push(vertex);

        targetColors.push(new THREE.Color(1, 1, 1));

        if (targets.length >= MAX_PARTICLES) break;
      }
    });

    if (!targets.length) return null;

    // =========================
    // CENTER MODEL
    // =========================

    const box = new THREE.Box3();

    targets.forEach((point) => {
      box.expandByPoint(point);
    });

    const center = new THREE.Vector3();

    box.getCenter(center);

    const modelScale = 1.75;

    targets.forEach((point) => {
      point.sub(center);
      point.multiplyScalar(modelScale);
    });

    // =========================
    // PARTICLE ARRAYS
    // =========================

    const positions = new Float32Array(targets.length * 3);

    const randomPositions = new Float32Array(targets.length * 3);
    const introPositions = new Float32Array(targets.length * 3);

    const colors = new Float32Array(targets.length * 3);

    const scatterX = 28;
    const scatterY = 20;
    const scatterZ = 14;

    targets.forEach((point, i) => {
      const i3 = i * 3;

      positions[i3] = point.x;
      positions[i3 + 1] = point.y;
      positions[i3 + 2] = point.z;

      randomPositions[i3] = (Math.random() - 0.5) * scatterX;

      randomPositions[i3 + 1] = (Math.random() - 0.5) * scatterY;

      randomPositions[i3 + 2] = (Math.random() - 0.5) * scatterZ;

      // Completely independent intro cloud
      introPositions[i3] = (Math.random() - 0.5) * 32;

      introPositions[i3 + 1] = (Math.random() - 0.5) * 22;

      introPositions[i3 + 2] = (Math.random() - 0.5) * 16;

      colors[i3] = targetColors[i].r;
      colors[i3 + 1] = targetColors[i].g;
      colors[i3 + 2] = targetColors[i].b;
    });

    // =========================
    // AMBIENT PARTICLES
    // =========================

    const ambientCount = 2200;

    const ambientPositions = new Float32Array(ambientCount * 3);

    for (let i = 0; i < ambientCount; i++) {
      const i3 = i * 3;

      ambientPositions[i3] = (Math.random() - 0.5) * 6.5;

      ambientPositions[i3 + 1] = (Math.random() - 0.5) * 3.8;

      ambientPositions[i3 + 2] = (Math.random() - 0.5) * 2;
    }

    return {
      positions,
      randomPositions,
      introPositions,
      colors,
      ambientPositions,
      count: targets.length,
      ambientCount,
      center,
      modelScale,
    };
  }, [scene]);

  // =========================
  // SOLID GLB
  // =========================

  const solidScene = useMemo(() => {
    if (!particleData) return null;

    const clone = scene.clone(true);

    clone.traverse((object) => {
      if (object.name === "head") {
        object.rotation.order = "YXZ";
      }
    });

    clone.traverse((object) => {
      if (!object.isMesh) return;

      if (Array.isArray(object.material)) {
        object.material = object.material.map((material) => {
          const clonedMaterial = material.clone();

          clonedMaterial.transparent = true;
          clonedMaterial.opacity = 0;

          return clonedMaterial;
        });
      } else if (object.material) {
        object.material = object.material.clone();

        object.material.transparent = true;
        object.material.opacity = 0;
      }
    });

    return clone;
  }, [scene, particleData]);

  // =========================
  // FRAME
  // =========================

  useFrame(() => {
    if (!pointsRef.current || !particleData || !solidScene) {
      return;
    }

    // =========================
    // FORMATION
    // 0 → 1
    // =========================

    const formationProgress = THREE.MathUtils.clamp(
      (progress - 1.25) / 0.75,
      0,
      1,
    );

    const positions = pointsRef.current.geometry.attributes.position.array;

    const time = performance.now() * 0.0005;

    const introMoveProgress = THREE.MathUtils.clamp(progress / 1.25, 0, 1);

    const introMoveEase =
      introMoveProgress * introMoveProgress * (3 - 2 * introMoveProgress);

    // const introOffsetX = introMoveEase * 1.2;
    const introOffsetX = 0;

    const introScatterStrength = THREE.MathUtils.clamp(
      (0.9 - progress) / 0.55,
      0,
      1,
    );

    const movementStrength = Math.max(
      1 - formationProgress,
      introScatterStrength,
    );

    for (let i = 0; i < particleData.count; i++) {
      const i3 = i * 3;

      const introChaos = THREE.MathUtils.clamp((0.9 - progress) / 0.9, 0, 1);

      const targetInfluence = THREE.MathUtils.clamp(
        (progress - 1.15) / 0.25,
        0,
        1,
      );

      const baseX = THREE.MathUtils.lerp(
        particleData.introPositions[i3],
        particleData.positions[i3],
        targetInfluence,
      );

      const baseY = THREE.MathUtils.lerp(
        particleData.introPositions[i3 + 1],
        particleData.positions[i3 + 1],
        targetInfluence,
      );

      const baseZ = THREE.MathUtils.lerp(
        particleData.introPositions[i3 + 2],
        particleData.positions[i3 + 2],
        targetInfluence,
      );

      const offset = i * 0.013;

      const floatX = Math.sin(time * 1.2 + offset) * 0.35 * movementStrength;

      const floatY =
        Math.cos(time * 0.9 + offset * 1.7) * 0.28 * movementStrength;

      const floatZ =
        Math.sin(time * 0.7 + offset * 2.3) * 0.22 * movementStrength;

      positions[i3] = baseX + floatX + introOffsetX;

      positions[i3 + 1] = baseY + floatY;

      positions[i3 + 2] = baseZ + floatZ;
    }

    // ---------------------------------------
    // CHAPTER ROTATION
    // ---------------------------------------
    //
    // Progress:
    // 0 = INTRO
    // 1 = CHAPTER 01
    // 2 = CHAPTER 02
    // 3 = CHAPTER 03
    // 4 = CHAPTER 04
    //
    // We deliberately DON'T rotate the model
    // continuously with progress anymore.
    //
    // Chapter 04 must end FRONT-FACING.
    // ---------------------------------------

    const chapterRotationProgress = THREE.MathUtils.clamp(progress, 0, 4);

    const easeInOut = (t) => t * t * (3 - 2 * t);

    let baseRotation = 0;

    if (chapterRotationProgress < 1) {
      const t = easeInOut(chapterRotationProgress);

      baseRotation = THREE.MathUtils.lerp(0, Math.PI * 0.75, t);
    } else if (chapterRotationProgress < 2) {
      const t = easeInOut(chapterRotationProgress - 1);

      baseRotation = THREE.MathUtils.lerp(Math.PI * 0.75, Math.PI * 1.25, t);
    } else if (chapterRotationProgress < 3) {
      const t = easeInOut(chapterRotationProgress - 2);

      baseRotation = THREE.MathUtils.lerp(Math.PI * 1.25, Math.PI * 1.75, t);
    } else {
      const t = easeInOut(chapterRotationProgress - 3);

      baseRotation = THREE.MathUtils.lerp(Math.PI * 1.75, Math.PI * 2, t);
    }

    // ---------------------------------------
    // EXTRA INTRO ROTATION
    // ---------------------------------------

    const introRotationProgress = THREE.MathUtils.clamp(
      (progress - 0.08) / 0.42,
      0,
      1,
    );

    const introRotationEase =
      introRotationProgress *
      introRotationProgress *
      (3 - 2 * introRotationProgress);

    const introRotation = introRotationEase * Math.PI * 0.75;

    // ---------------------------------------
    // FINAL ROTATION
    // ---------------------------------------

    const rotation = progress < 0.5 ? -introRotation : baseRotation;

    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(0, rotation, 0);
    }

    if (solidGroupRef.current) {
      solidGroupRef.current.rotation.set(0, rotation, 0);
    }

    // =========================
    // SOLID TRANSITION
    // 1.5 → 2
    // =========================

    const solidProgress = THREE.MathUtils.clamp((progress - 1.8) / 0.2, 0, 1);

    const solidEase = solidProgress * solidProgress * (3 - 2 * solidProgress);

    // =========================
    // PARTICLES FADE OUT
    // =========================

    // =========================
    // PARTICLE REVEAL
    // =========================
    //
    // Hidden during the pure white intro.
    // Slowly appears as the white square
    // compresses into the particle field.
    //

    const particleRevealProgress = THREE.MathUtils.clamp(
      (progress - 0.42) / 0.38,
      0,
      1,
    );

    const particleRevealEase =
      particleRevealProgress *
      particleRevealProgress *
      (3 - 2 * particleRevealProgress);

    // =========================
    // PARTICLES FADE OUT
    // =========================
    //
    // They remain visible until the
    // solid GLB takes over.
    //

    const introParticleOpacity = THREE.MathUtils.clamp(
      (progress - 0.62) / 0.28,
      0,
      1,
    );

    const introParticleEase =
      introParticleOpacity *
      introParticleOpacity *
      (3 - 2 * introParticleOpacity);

    pointsRef.current.material.opacity = introParticleEase * (1 - solidEase);

    const particleSize = THREE.MathUtils.lerp(
      0.018,
      0.028,
      1 - formationProgress,
    );

    pointsRef.current.material.size = particleSize;

    // =========================
    // SOLID GLB FADE IN
    // =========================

    solidScene.traverse((object) => {
      if (!object.isMesh) return;

      if (Array.isArray(object.material)) {
        object.material.forEach((material) => {
          material.opacity = solidEase;
        });
      } else if (object.material) {
        object.material.opacity = solidEase;
      }
    });

    // =========================
    // HEAD CURSOR TRACKING
    // =========================
    //
    // Activate only after the model
    // has formed.
    //
    // Body stays completely still.
    // Only "head" rotates.
    // =========================

    // =========================
    // HEAD CURSOR TRACKING
    // =========================

    const head = solidScene.getObjectByName("head");

    if (head) {
      const trackingProgress = THREE.MathUtils.clamp(
        (progress - 0.95) / 0.35,
        0,
        1,
      );

      // =========================
      // CURSOR
      // =========================

      const cursorX = mouseRef.current.x;
      const cursorY = mouseRef.current.y;

      // =========================
      // HEAD LIMITS
      // =========================

      const maxYaw = 0.35;
      const maxPitch = 0.18;

      // =========================
      // TARGET ROTATION
      // =========================

      const targetYaw = cursorX * maxYaw * trackingProgress;

      const targetPitch = cursorY * maxPitch * trackingProgress;

      // =========================
      // SMOOTH ROTATION
      // =========================

      headRotationRef.current.y = THREE.MathUtils.lerp(
        headRotationRef.current.y,
        targetYaw,
        0.08,
      );

      headRotationRef.current.x = THREE.MathUtils.lerp(
        headRotationRef.current.x,
        targetPitch,
        0.08,
      );

      // =========================
      // APPLY
      // =========================

      head.rotation.y = headRotationRef.current.y;
      head.rotation.x = headRotationRef.current.x;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!particleData || !solidScene) {
    return null;
  }

  return (
    <>
      {/* =========================
          PARTICLE MODEL
          ========================= */}

      <group ref={modelGroupRef}>
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[particleData.randomPositions.slice(), 3]}
            />

            <bufferAttribute
              attach="attributes-color"
              args={[particleData.colors.slice(), 3]}
            />
          </bufferGeometry>

          <pointsMaterial
            size={0.03}
            sizeAttenuation
            transparent
            opacity={0}
            depthWrite={false}
          />
        </points>
      </group>

      {/* =========================
          SOLID GLB
          ========================= */}

      <group
        ref={solidGroupRef}
        position={[
          -particleData.center.x * particleData.modelScale,

          -particleData.center.y * particleData.modelScale,

          -particleData.center.z * particleData.modelScale,
        ]}
        scale={[
          particleData.modelScale,
          particleData.modelScale,
          particleData.modelScale,
        ]}
      >
        <primitive object={solidScene} />
      </group>

      {/* =========================
          AMBIENT PARTICLES
          ========================= */}

      <points ref={ambientRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particleData.ambientPositions, 3]}
          />
        </bufferGeometry>

        <pointsMaterial
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </points>
    </>
  );
}

export default function ParticleCanvas({ progress = 0 }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 5],
        fov: 45,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <ambientLight intensity={0.6} />

      <directionalLight position={[5, 5, 5]} intensity={1.2} />

      <directionalLight position={[-4, 2, 3]} intensity={0.5} />

      <ParticleModel progress={progress} />
    </Canvas>
  );
}

useGLTF.preload("/models/untitled-6.glb");
