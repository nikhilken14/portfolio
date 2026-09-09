import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Particle.css";

export default function Particle() {
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

    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Particle Cloud
    const particlesGeo = new THREE.BufferGeometry();
    const count = 500;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.7,
    });
    const particlePoints = new THREE.Points(particlesGeo, particlesMat);
    coreGroup.add(particlePoints);

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

      particlePoints.rotation.y = elapsedTime * 0.03;
      particlePoints.rotation.x = elapsedTime * 0.02;

      // Parallax mouse sway
      coreGroup.rotation.x += (mouseY * 0.2 - coreGroup.rotation.x) * 0.05;
      coreGroup.rotation.y += (mouseX * 0.2 - coreGroup.rotation.y) * 0.05;

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
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="particle-background" />;
}