import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EXPERIENCES = [
  {
    id: '01',
    name: "Spencer's Retail — E-Commerce Intern",
    description: 'Led end-to-end catalogue operations including content accuracy auditing, product taxonomy mapping, and fulfilment issue resolution. Executed competitor benchmarking and assortment gap analysis; identified and corrected 50+ underperforming SKU listings to improve organic discoverability.',
    tech: ['Catalogue Ops', 'Assortment Planning', 'Competitor Benchmarking', 'SKU Analysis'],
    link: '#',
    period: 'Oct 2025 – Present',
    result: '30% increase in conversion rate'
  },
  {
    id: '02',
    name: 'Bajaj Consumer Care — Sales & Distribution Analyst',
    description: 'Mapped SKU availability, pricing gaps, and distributor execution across 7+ regions and 180+ retail outlets. Proposed a Rs.10–20 rural pack strategy to improve last-mile penetration. Delivered margin and credit-term analysis supporting trade channel optimisation.',
    tech: ['Sales Analysis', 'Pricing Strategy', 'Distribution Mapping', 'Trade Marketing'],
    link: '#',
    period: 'Sep – Oct 2025',
    result: '180+ outlets audited across 7 regions'
  },
  {
    id: '03',
    name: 'Spencer\'s Jiffy — Post-Purchase Experience & CX Operations',
    description: 'As Program Management Trainee, owned post-purchase SLA reduction from 24+ hours to under 1 hour through tiered resolution framework design. Built competitive intelligence framework benchmarking against Blinkit, Zepto, and Swiggy Instamart across 7 Kolkata delivery clusters.',
    tech: ['CX Operations', 'SLA Framework', 'Process Mapping', 'Competitive Intelligence'],
    link: '#',
    period: 'SIP 2025–26',
    result: '95%+ SLA improvement'
  },
  {
    id: '04',
    name: 'Diverse Genomics — Campaign Execution & Outreach',
    description: 'Planned and executed performance-tracked digital campaigns on LinkedIn and Instagram. Achieved 60% higher reach and engaged 400+ students through targeted content and stakeholder coordination.',
    tech: ['Digital Marketing', 'LinkedIn Campaigns', 'Content Strategy', 'Stakeholder Coordination'],
    link: '#',
    period: 'Jun 2025 – Feb 2026',
    result: '60% higher reach, 400+ students engaged'
  },
  {
    id: '05',
    name: 'DIKSHA — Field Operations Lead (Volunteer)',
    description: 'Managed 20+ volunteers and on-ground operations; enabled outreach to 170+ children and women across underserved communities. Coordinated education and health programs in flexible commitment alongside academic schedule.',
    tech: ['Operations Management', 'Volunteer Coordination', 'Community Outreach', 'Event Planning'],
    link: '#',
    period: 'Jul 2025 – Jan 2026',
    result: '170+ children and women reached'
  },
  {
    id: '06',
    name: 'Harvard Business Publishing Simulation',
    description: 'Secured 1st place in a Harvard Business Publishing simulation by applying structured decision-making, supply chain trade-off analysis, and execution sequencing to drive market share growth.',
    tech: ['Strategic Decision Making', 'Supply Chain Analysis', 'Go-to-Market Strategy', 'Simulation'],
    link: '#',
    period: 'Academic Project',
    result: '35% market share growth, 1st place'
  }
];

const ProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const glareRef = useRef(null);
  const tetherRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Optimized 3D Tilt
    gsap.to(cardRef.current, {
      rotateY: x * 15,
      rotateX: -y * 12,
      z: 20,
      scale: 1.01,
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.3,
      overwrite: 'auto'
    });

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        opacity: 1,
        duration: 0.2
      });
    }

    if (glareRef.current) {
      gsap.to(glareRef.current, {
        x: (0.5 - x) * 100,
        y: (0.5 - y) * 100,
        opacity: 0.3,
        duration: 0.4
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      z: 0,
      scale: 1,
      ease: 'power3.out',
      duration: 0.5,
      overwrite: 'auto'
    });

    if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
    if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
  };

  return (
    <div className={index % 3 === 1 ? 'w-full lg:translate-y-10' : index % 3 === 2 ? 'w-full lg:-translate-y-4' : 'w-full'} style={{ perspective: '1500px' }}>
      <div
        className="project-card relative w-full min-h-[410px] rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.95))] p-8 flex flex-col justify-between shadow-xl"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Audio Reactive Inner Layer (No conflict with tilt) */}
        <div className="absolute inset-0 audio-reactive pointer-events-none opacity-20 bg-red-600/5 rounded-[1.75rem]" />

        {/* Dynamic Glare */}
        <div 
          ref={glareRef}
          className="absolute inset-0 pointer-events-none opacity-0 z-40"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            mixBlendMode: 'overlay',
            transform: 'translateZ(50px)'
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.05),transparent_40%)]" />
        
        <div
          ref={glowRef}
          className="absolute w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
        />

        <div className="absolute right-5 top-5 h-2 w-2 rounded-full bg-red-600 shadow-[0_0_15px_#ef4444]" style={{ transform: 'translateZ(30px)' }} />
        
        <div className="relative z-20 flex justify-between items-start mb-6" style={{ transform: 'translateZ(25px)' }}>
          <span className="text-red-500 font-mono text-[10px] tracking-[0.3em] font-bold uppercase">
            EXP // {project.id}
          </span>
          <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">
            {project.period}
          </span>
        </div>

        <div className="relative z-20 flex-1" style={{ transform: 'translateZ(40px)' }}>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-md">
            {project.name}
          </h3>

          <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light" style={{ transform: 'translateZ(20px)' }}>
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4" style={{ transform: 'translateZ(30px)' }}>
            {project.tech.map((tool) => (
              <span key={tool} className="text-[9px] uppercase tracking-wider px-2 py-1 border border-red-500/20 rounded-md text-gray-300 font-medium bg-red-950/10">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-20 pt-4 border-t border-white/5" style={{ transform: 'translateZ(35px)' }}>
          <div className="flex items-center justify-between gap-4">
            <span className="text-red-500 text-sm font-bold tracking-tighter uppercase animate-pulse">
              {project.result}
            </span>
            <a href={project.link} className="text-white opacity-40 hover:opacity-100 transition-opacity">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5"></line>
                <polyline points="10 5 19 5 19 14"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function Projects() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      });
      
      if (headerRef.current) {
        tl.fromTo(headerRef.current.children,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
        );
      }
      
      const cards = sectionRef.current.querySelectorAll('.project-card');
      if (cards.length > 0) {
        tl.fromTo(cards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power2.out" },
          "-=0.4"
        );
      }
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="w-full min-h-screen bg-[#030303] py-24 md:py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden scroll-mt-24 md:scroll-mt-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_26%)]" />
      <div className="absolute left-0 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/10 blur-[180px]" />
      <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] translate-x-1/3 rounded-full bg-white/5 blur-[160px]" />

      <div className="max-w-[90rem] mx-auto w-full relative z-10">

        {/* Header Block */}
        <div ref={headerRef} className="mb-20 md:mb-32 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-12 relative group/header">
          {/* Spider-Sense Ripple Effect */}
          <div className="absolute -left-10 top-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl opacity-0 group-hover/header:opacity-100 transition-opacity duration-700 animate-pulse" />
          
          <div className="max-w-3xl relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-16 bg-gradient-to-r from-red-600 to-transparent shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <span className="text-[12px] uppercase tracking-[0.5em] text-red-500 font-bold font-mono animate-pulse">Experience Web</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-white font-sans leading-[0.9] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-6">
              Career <span className="font-serif italic font-light opacity-90 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-white pr-4">Timeline</span>
            </h2>
          </div>
          <div className="relative group/text">
            <p className="text-gray-400 font-light tracking-wide text-lg md:text-xl max-w-sm mt-8 md:mt-0 leading-relaxed md:text-right group-hover/text:text-gray-300 transition-colors duration-500">
              Transforming category data into <span className="text-white font-medium">measurable business results</span> through strategic execution.
            </p>
            <div className="absolute -right-4 top-0 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent hidden md:block" />
          </div>
        </div>
        
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 place-items-stretch relative">
          {/* Web line connecting cards - decorative */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="web-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(239,68,68,0)" />
                  <stop offset="50%" stopColor="rgba(239,68,68,0.08)" />
                  <stop offset="100%" stopColor="rgba(239,68,68,0)" />
                </linearGradient>
              </defs>
              <line x1="16.66%" y1="25%" x2="50%" y2="25%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <line x1="50%" y1="25%" x2="83.33%" y2="25%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <line x1="16.66%" y1="25%" x2="16.66%" y2="75%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <line x1="83.33%" y1="25%" x2="83.33%" y2="75%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <line x1="16.66%" y1="75%" x2="50%" y2="75%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <line x1="50%" y1="75%" x2="83.33%" y2="75%" stroke="url(#web-grad)" strokeWidth="1" strokeDasharray="4 8"/>
              <circle cx="16.66%" cy="25%" r="3" fill="rgba(239,68,68,0.3)"/>
              <circle cx="50%" cy="25%" r="3" fill="rgba(239,68,68,0.3)"/>
              <circle cx="83.33%" cy="25%" r="3" fill="rgba(239,68,68,0.3)"/>
              <circle cx="16.66%" cy="75%" r="3" fill="rgba(239,68,68,0.3)"/>
              <circle cx="50%" cy="75%" r="3" fill="rgba(239,68,68,0.3)"/>
              <circle cx="83.33%" cy="75%" r="3" fill="rgba(239,68,68,0.3)"/>
            </svg>
          </div>
          {EXPERIENCES.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}
