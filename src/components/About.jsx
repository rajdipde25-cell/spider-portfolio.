import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import rajdipPhoto from '../assets/rajdip.jpg';

gsap.registerPlugin(ScrollTrigger);

const SKILLS = [
  'Catalogue Management & Auditing',
  'Assortment Planning',
  'Conversion Rate Optimisation',
  'SKU Analysis & Pricing Strategy',
  'Competitor Benchmarking',
  'Advanced Excel & Power BI',
  'Vendor Coordination',
  'Cross-functional Collaboration'
];

const EDUCATION = [
  { degree: 'PGDM', school: 'International Management Institute Kolkata', year: '2025 – 2027', detail: 'Pursuing' },
  { degree: 'BBA (Honours)', school: 'Cooch Behar College', year: '2022 – 2025', detail: '86.44%' },
  { degree: 'Class XII', school: 'Dewanhat High School', year: '2021', detail: '87.00%' },
  { degree: 'Class X', school: 'Jenkins School', year: '2019', detail: '86.14%' }
];

export default function About() {
  const sectionRef = useRef(null);
  const container3DRef = useRef(null);
  const textContainerRef = useRef(null);
  const imageContainerRef = useRef(null);
  const photoRef = useRef(null);
  const webLeftRef = useRef(null);
  const webRightRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance 3D Transition Animation (No webs)
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

      // 2. Existing content reveal
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
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' },
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
            {/* Soft overlay decoration (no webs) */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }} />
          </div>
        </div>

        {/* Right Column: Story & Details */}
        <div ref={textContainerRef} className="flex flex-col justify-center space-y-10">

          <div className="overflow-hidden">
            <h2 className="stagger-reveal text-5xl md:text-6xl font-bold tracking-tighter text-white font-sans leading-tight">
              About <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-serif italic pr-4">Me</span>
            </h2>
          </div>

          <div className="overflow-hidden">
            <p className="stagger-reveal text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl">
              E-Commerce and Category Management professional with hands-on experience in catalogue operations, assortment planning, SKU-level performance analysis, and conversion rate optimisation. Skilled in competitor benchmarking, pricing strategy, product discoverability, and vendor coordination. Proven track record of driving measurable category outcomes through data-driven, cross-functional delivery.
            </p>
          </div>

          {/* Education */}
          <div className="overflow-hidden">
            <div className="stagger-reveal space-y-4 pt-4 border-t border-white/10 max-w-xl">
              <h3 className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-4">Education</h3>
              {EDUCATION.map((edu, i) => (
                <div key={i} className="flex items-start justify-between group">
                  <div>
                    <p className="text-white font-medium">{edu.degree}</p>
                    <p className="text-gray-400 text-sm">{edu.school}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">{edu.year}</p>
                    <p className="text-red-400 text-xs">{edu.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expertise Highlights */}
          <div className="overflow-hidden">
            <div className="stagger-reveal grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t border-white/10 max-w-xl">
              {SKILLS.map((skill, i) => (
                <div key={i} className="flex items-center space-x-3 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-red-500 transition-colors duration-300" />
                  <span className="text-gray-300 text-sm md:text-base font-medium tracking-wide group-hover:text-white transition-colors duration-300">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Block */}
          <div className="overflow-hidden mt-6">
            <blockquote className="stagger-reveal border-l-2 border-red-500/50 pl-6 py-2">
              <p className="text-xl md:text-2xl text-gray-200 font-serif italic">
                "Execution builds the foundation. <br /> Data drives the decisions."
              </p>
            </blockquote>
          </div>

        </div>

      </div>
    </section>
  );
}
