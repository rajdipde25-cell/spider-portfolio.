import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rajdipPhoto from '../assets/rajdip.jpg';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  'Consumer Insights & Research',
  'Quick Commerce Operations',
  'Retail Distribution Strategy',
  'Retention & TAT Optimization',
  'Category Diagnostics',
  'SKU-Level Pricing Architecture',
  'Trade Channel Optimization',
  'Advanced Excel & Power BI'
];

const EDUCATION = [
  { degree: 'PGDM (Marketing)', school: 'IMI Kolkata', year: '2025 – 2027', detail: 'S.M.A.R.T Cell: Branding & Media' },
  { degree: 'BBA', school: 'Cooch Behar College', year: '2022 – 2025', detail: '86.44% Aggregate' }
];

const CERTIFICATIONS = [
  { name: 'IBM Product Manager Certificate', issuer: 'IBM / Coursera', date: 'May 2026' },
  { name: 'Global Impact: Business Ethics', issuer: 'UIUC', date: 'Nov 2025' }
];

export default function About() {
  const sectionRef = useRef(null);
  const container3DRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance 3D Transition
      const tlEntrance = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      });

      tlEntrance.fromTo(container3DRef.current,
        { 
          rotateX: -45, 
          scale: 0.8, 
          z: -300,
          y: 100,
          transformOrigin: 'top center'
        },
        { 
          rotateX: 0, 
          scale: 1, 
          z: 0, 
          y: 0,
          ease: 'none'
        }
      );

      // 2. Content reveal
      const tlContent = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      const textElements = textContainerRef.current.querySelectorAll('.stagger-reveal');
      const imgElement = imageContainerRef.current;

      tlContent.fromTo(imgElement,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(textElements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' },
        '-=0.8'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 3D tilt effect on photo
  useEffect(() => {
    const photo = photoRef.current;
    if (!photo) return;

    const handleMouseMove = (e) => {
      const rect = photo.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(photo, {
        rotateY: x * 15,
        rotateX: -y * 15,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.4
      });
    };

    const handleMouseLeave = () => {
      gsap.to(photo, {
        rotateY: 0,
        rotateX: 0,
        ease: 'power3.out',
        duration: 0.6
      });
    };

    photo.addEventListener('mousemove', handleMouseMove);
    photo.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      photo.removeEventListener('mousemove', handleMouseMove);
      photo.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black flex items-center justify-center py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ perspective: '2000px' }}
    >
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div 
        ref={container3DRef}
        className="max-w-[90rem] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
      >

        {/* Left Column: Portrait with 3D tilt */}
        <div
          ref={imageContainerRef}
          className="relative w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-red-500/10"
          style={{ perspective: '1000px' }}
        >
          <div
            ref={photoRef}
            className="relative"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.4s ease-out' }}
          >
            <img
              src={rajdipPhoto}
              alt="Rajdip De Sarkar"
              className="w-full h-auto object-cover object-top grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }} />
          </div>
        </div>

        {/* Right Column: Story & Details */}
        <div ref={textContainerRef} className="flex flex-col justify-center space-y-8">

          <div className="overflow-hidden">
            <h2 className="stagger-reveal text-5xl md:text-6xl font-bold tracking-tighter text-white font-sans leading-tight">
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-serif italic pr-4">Me</span>
            </h2>
          </div>

          <div className="overflow-hidden">
            <p className="stagger-reveal text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl">
              I am a marketing and customer retention professional driven by field-validated research and operational execution. From auditing 150+ retail outlets to slashing resolution TAT from 24 hours to 15 minutes, my work bridges the gap between raw market data and scalable commercial decisions. 
            </p>
            <p className="stagger-reveal text-base text-gray-500 font-light leading-relaxed max-w-xl mt-4">
              Currently pursuing my PGDM at IMI Kolkata, I focus on how consumer insights drive quick commerce operations and retail distribution architecture. I don’t just watch the market—I diagnose it to solve retention and distribution problems.
            </p>
          </div>

          {/* Education & Certifications */}
          <div className="overflow-hidden">
            <div className="stagger-reveal grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-white/10 max-w-xl">
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-4">Education</h3>
                {EDUCATION.map((edu, i) => (
                  <div key={i} className="group">
                    <p className="text-white font-medium text-sm">{edu.degree}</p>
                    <p className="text-gray-400 text-[12px]">{edu.school}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-red-400 text-[11px] italic">{edu.detail}</p>
                      <p className="text-gray-500 text-[11px]">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-4">Certifications</h3>
                {CERTIFICATIONS.map((cert, i) => (
                  <div key={i} className="group">
                    <p className="text-white font-medium text-sm">{cert.name}</p>
                    <p className="text-gray-400 text-[12px]">{cert.issuer}</p>
                    <p className="text-gray-500 text-[11px] mt-1">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expertise Highlights */}
          <div className="overflow-hidden">
            <div className="stagger-reveal grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t border-white/10 max-w-xl">
              {SKILLS.map((skill, i) => (
                <div key={i} className="flex items-center space-x-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-red-500 transition-colors duration-300" />
                  <span className="text-gray-300 text-[13px] md:text-sm font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Block */}
          <div className="overflow-hidden mt-2">
            <blockquote className="stagger-reveal border-l-2 border-red-500/50 pl-6 py-2">
              <p className="text-lg md:text-xl text-gray-200 font-serif italic">
                "Execution builds the foundation. <br /> Data drives the decisions."
              </p>
            </blockquote>
          </div>

        </div>

      </div>
    </section>
  );
}
