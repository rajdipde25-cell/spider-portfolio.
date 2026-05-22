import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { vertexShader, fragmentShader } from './HeroShaders';

gsap.registerPlugin(ScrollTrigger);

import imgSpiderman from '../assets/spiderman/20260407_055437.png';
import imgRajdip from '../assets/rajdip.jpg';

export default function Hero() {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const hero3DRef = useRef(null);
  const sectionRef = useRef(null);

  const uniformRef = useRef(null);
  const mouseTarget = useRef({ x: 0.5, y: 0.5 });
  const mouseCurrent = useRef({ x: 0.5, y: 0.5 });

  const [isHovered, setIsHovered] = useState(false);

  // 3D Scroll Exit Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true,
          pinSpacing: false
        },
        z: -500,
        rotateX: 15,
        opacity: 0,
        filter: "blur(10px)",
        ease: "none"
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Initial Hero Entrance Animation
    gsap.fromTo(container,
      { opacity: 0, y: 80 },
      { opacity: 1, y: 0, duration: 2, ease: 'power3.out', delay: 0.1 }
    );

    // Text entrance animation
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.8 }
      );
    }

    // 1. Setup Three.js Scene
    const scene = new THREE.Scene();
    const bgScene = new THREE.Scene();
    
    // Cameras
    const bgCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const mainCamera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    mainCamera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });

    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // 2. Load textures
    const textureLoader = new THREE.TextureLoader();
    let isTexturesLoaded = false;

    const uniforms = {
      uTexture1: { value: null },
      uTexture2: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHovered: { value: 0.0 },
      uRadius: { value: 0.25 },
      uSoftness: { value: 0.15 },
      uScale: { value: 0.05 },
      uResolution: { value: new THREE.Vector2(width, height) },
      uImageResolution: { value: new THREE.Vector2(1920, 1080) }
    };

    uniformRef.current = uniforms;

    Promise.all([
      textureLoader.loadAsync(imgSpiderman),
      textureLoader.loadAsync(imgRajdip)
    ]).then(([tex1, tex2]) => {
      tex1.generateMipmaps = false;
      tex1.minFilter = THREE.LinearFilter;
      tex1.magFilter = THREE.LinearFilter;

      tex2.generateMipmaps = false;
      tex2.minFilter = THREE.LinearFilter;
      tex2.magFilter = THREE.LinearFilter;

      uniforms.uTexture1.value = tex1;
      uniforms.uTexture2.value = tex2;

      if (tex1.image) {
        uniforms.uImageResolution.value.set(tex1.image.width, tex1.image.height);
      }

      isTexturesLoaded = true;
    });

    // 3. Create full-screen plane geometry for background shader
    const bgGeometry = new THREE.PlaneGeometry(2, 2);
    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms
    });

    const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
    bgScene.add(bgMesh);

    // 4. Create 3D Particle Web-Sphere - Optimized
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);
    const radius = 3.5;

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = radius * Math.cos(phi);
    }

    const particlesGeometry = new THREE.BufferAttribute(posArray, 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', particlesGeometry);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xef4444,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    // scene.add(particlesMesh); // Removed to avoid 'stars' look

    // 5. GSAP Ticker for render loop
    const renderTick = (time, deltaTime) => {
      if (!isTexturesLoaded) return;

      mouseCurrent.current.x = gsap.utils.interpolate(mouseCurrent.current.x, mouseTarget.current.x, 0.1);
      mouseCurrent.current.y = gsap.utils.interpolate(mouseCurrent.current.y, mouseTarget.current.y, 0.1);

      uniforms.uMouse.value.set(mouseCurrent.current.x, mouseCurrent.current.y);

      // Rotate scene
      scene.rotation.y += 0.001;

      // Mouse reaction for 3D particles
      const targetRotationX = (mouseCurrent.current.y - 0.5) * 0.5;
      const targetRotationY = (mouseCurrent.current.x - 0.5) * 0.5;
      scene.rotation.x = gsap.utils.interpolate(scene.rotation.x, targetRotationX, 0.05);
      scene.rotation.y = gsap.utils.interpolate(scene.rotation.y, targetRotationY, 0.05);

      if (cursorRef.current) {
        gsap.set(cursorRef.current, {
          x: mouseCurrent.current.x * width,
          y: mouseCurrent.current.y * height,
        });
      }

      renderer.clear();
      renderer.render(bgScene, bgCamera);
      renderer.render(scene, mainCamera);
    };

    gsap.ticker.add(renderTick);

    // 5. Setup interaction event handlers
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / width;
      const y = 1.0 - ((e.clientY - rect.top) / height);

      mouseTarget.current.x = x;
      mouseTarget.current.y = y;

      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });
      }
    };

    const onMouseEnter = () => {
      setIsHovered(true);
      gsap.to(uniforms.uHovered, {
        value: 1.0,
        duration: 1.2,
        ease: 'power3.out'
      });
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      setIsHovered(false);
      gsap.to(uniforms.uHovered, {
        value: 0.0,
        duration: 1.2,
        ease: 'power3.out'
      });
      if (cursorRef.current) {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      }
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    // 6. Handle resize
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', onResize);

    // Mobile fallback
    const onTouch = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseTarget.current.x = (touch.clientX - rect.left) / width;
        mouseTarget.current.y = 1.0 - ((touch.clientY - rect.top) / height);

        if (!isHovered) {
          onMouseEnter();
        }
      }
    };

    container.addEventListener('touchstart', onTouch);
    container.addEventListener('touchmove', onTouch);

    // 7. Cleanup
    return () => {
      gsap.ticker.remove(renderTick);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('touchstart', onTouch);
      container.removeEventListener('touchmove', onTouch);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bgMaterial.dispose();
      bgGeometry.dispose();
      particlesMaterial.dispose();
      geo.dispose();
    };

  }, []);

  // 3D parallax tilt effect
  useEffect(() => {
    const hero3D = hero3DRef.current;
    if (!hero3D) return;

    const handleMouseMove = (e) => {
      const rect = hero3D.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(hero3D, {
        rotateY: x * 5,
        rotateX: -y * 5,
        transformPerspective: 1500,
        ease: 'power2.out',
        duration: 0.5
      });
    };

    const handleMouseLeave = () => {
      gsap.to(hero3D, {
        rotateY: 0,
        rotateX: 0,
        ease: 'power3.out',
        duration: 0.8
      });
    };

    hero3D.addEventListener('mousemove', handleMouseMove);
    hero3D.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      hero3D.removeEventListener('mousemove', handleMouseMove);
      hero3D.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 select-none"
      />

      {/* Custom Cursor / Light Bloom Overlay */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-32 h-32 rounded-full pointer-events-none z-20 mix-blend-screen opacity-0 scale-0"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0) 70%)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Foreground UI Components with 3D tilt */}
      <div ref={textRef} className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center w-full" style={{ perspective: '1500px' }}>
        <div ref={hero3DRef} className="w-full max-w-[90rem] px-8 lg:px-16" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="w-full flex flex-col md:flex-row justify-between md:items-center transition-all duration-700 ease-out transform gap-10 lg:gap-16"
            style={{ transform: isHovered ? 'translateY(-20px)' : 'translateY(0px)' }}
          >

            {/* Left Side: Intro and Title */}
            <div className="flex-1 max-w-lg lg:max-w-xl text-left">
              <div className="relative inline-block mb-6">
                <p className="text-sm md:text-base text-red-500 font-bold tracking-[0.4em] uppercase opacity-90 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                  I Study Consumers. I Solve Commerce Problems.
                </p>
                <div className="absolute -inset-1 bg-red-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[1] font-sans">
                Marketing &<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-gray-400 font-serif italic font-light pr-4 relative">
                  Customer
                  <span className="absolute bottom-2 left-0 w-full h-[1px] bg-red-500/30 blur-[1px]" />
                </span><br />
                Retention
              </h1>
            </div>

            {/* Right Side: Description and CTA */}
            <div className="flex-1 max-w-[32rem] ml-auto text-left md:text-right flex flex-col md:items-end rounded-[2.5rem] border border-white/10 bg-black/40 backdrop-blur-xl px-8 py-8 md:px-10 md:py-10 shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative overflow-hidden group/box">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover/box:bg-red-600/10 transition-colors duration-700" />
              
              <p className="max-w-[28rem] text-base md:text-lg text-gray-300 drop-shadow-xl font-light tracking-wide leading-relaxed mb-10 relative z-10">
                Exploring consumer behaviour, commerce systems, and market strategy through real-world projects and field research. PGDM at IMI Kolkata.
              </p>

              <a href="#contact" className="pointer-events-auto px-10 py-5 rounded-full border border-red-500/40 text-white text-sm tracking-[0.3em] uppercase font-bold hover:border-red-500 transition-all duration-500 backdrop-blur-sm shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] inline-block relative overflow-hidden group/btn">
                <span className="relative z-10 transition-transform duration-500 group-hover/btn:scale-110 block">Get in Touch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 scale-x-0 origin-right group-hover/btn:scale-x-100 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Overlay border/frame for cinematic effect */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />

      {/* Spider-Man emblem glow */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-red-600/20 blur-xl animate-pulse" />
      </div>
    </div>
  );
}
