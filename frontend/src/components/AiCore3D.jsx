import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AiCore3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D central elements
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Outer Tech Wireframe Object (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // 2. Inner Glowing Core (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(1.3, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0070f3,
      emissive: 0x0044aa,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // 3. Floating Circuit Points / Particle Cloud
    const particlesGeo = new THREE.BufferGeometry();
    const count = 400;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 12;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.6,
    });
    const particlePoints = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlePoints);

    // 4. Wave Grid Base (Topography effect)
    const planeGeo = new THREE.PlaneGeometry(20, 20, 40, 40);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x0a2540,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = -Math.PI / 2.5;
    planeMesh.position.y = -3.5;
    scene.add(planeMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 3, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 3D rotation
      outerMesh.rotation.y = elapsedTime * 0.15;
      outerMesh.rotation.x = elapsedTime * 0.1;

      innerMesh.rotation.y = -elapsedTime * 0.3;
      innerMesh.rotation.z = elapsedTime * 0.2;

      particlePoints.rotation.y = elapsedTime * 0.05;

      // Topography wave movement
      const pos = planeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const v = pos.getY(i);
        const z = Math.sin(u * 0.5 + elapsedTime * 2) * 0.2 + Math.cos(v * 0.5 + elapsedTime * 1.5) * 0.2;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;

      // Parallax mouse sway
      coreGroup.rotation.x += (mouseY * 0.3 - coreGroup.rotation.x) * 0.05;
      coreGroup.rotation.y += (mouseX * 0.3 - coreGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="ai-core-canvas" />;
}