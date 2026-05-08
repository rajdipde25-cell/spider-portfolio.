import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const mobileLinksRef = useRef([]);
  const glowRef = useRef(null);

  // Scroll Event Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initial Load Animation
  useEffect(() => {
    const tl = gsap.timeline();
    
    // Animate Navbar dropping down
    tl.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    
    // Stagger in the links
    if (linksRef.current.length > 0) {
      tl.fromTo(linksRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        "-=0.6"
      );
    }
  }, []);

  // Mouse Glow Interaction
  const handleMouseMove = (e) => {
    if (!glowRef.current || !navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    gsap.to(glowRef.current, {
      x,
      y,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  // Mobile Menu Animation Toggle
  useEffect(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(150% at 90% 10%)',
        duration: 0.8,
        ease: 'power3.inOut'
      });
      gsap.fromTo(mobileLinksRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        clipPath: 'circle(0% at 90% 10%)',
        duration: 0.6,
        ease: 'power3.inOut'
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav 
        ref={navRef}
        onMouseMove={handleMouseMove}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 overflow-hidden ${
          isScrolled 
            ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.7)] py-4' 
            : 'bg-transparent py-8'
        }`}
      >
        {/* Subtle Background Glow Mask */}
        <div 
          ref={glowRef}
          className="pointer-events-none absolute w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-0 md:opacity-100 transition-opacity duration-500"
        />

        {/* Glitch Overlay for Navbar */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-red-500/20 translate-x-[2px] animate-pulse" style={{ animationDuration: '0.15s' }} />
          <div className="absolute inset-0 bg-blue-500/20 -translate-x-[2px] animate-pulse" style={{ animationDuration: '0.2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative z-10">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* Spiderman Mask Logo */}
            <div className="relative w-10 h-10 flex items-center justify-center audio-reactive">
              <div className="absolute inset-0 bg-red-600/20 rounded-full blur-md group-hover:bg-red-600/40 transition-colors" />
              <svg viewBox="0 0 100 100" className="w-8 h-8 relative z-10 transition-transform duration-500 group-hover:scale-110">
                {/* Mask Contour */}
                <path 
                  d="M50 95 C20 85 5 60 5 35 C5 15 25 5 50 5 C75 5 95 15 95 35 C95 60 80 85 50 95 Z" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="4"
                />
                {/* Eyes */}
                <path 
                  d="M25 40 Q35 35 45 45 Q35 60 25 55 Z" 
                  fill="white" 
                  stroke="black" 
                  strokeWidth="1"
                />
                <path 
                  d="M75 40 Q65 35 55 45 Q65 60 75 55 Z" 
                  fill="white" 
                  stroke="black" 
                  strokeWidth="1"
                />
                {/* Simple Web Lines in Mask */}
                <path d="M50 5 L50 95" stroke="#ef4444" strokeWidth="1" opacity="0.4" />
                <path d="M5 35 L95 35" stroke="#ef4444" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-[0.2em] uppercase text-xs leading-none">
                Rajdip
              </span>
              <span className="text-red-500 font-mono text-[8px] uppercase tracking-[0.3em] mt-1 opacity-80">
                Spider-Category
              </span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-10">
            {NAV_LINKS.map((link, index) => (
              <a 
                key={link.name} 
                href={link.href}
                ref={el => linksRef.current[index] = el}
                className="relative text-gray-400 hover:text-white text-sm font-medium tracking-wide transition-colors duration-300 group"
              >
                {link.name}
                {/* Center-out underline animation */}
                <span className="absolute -bottom-1 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button 
              ref={el => linksRef.current[NAV_LINKS.length] = el} // animate with the links
              className="relative px-6 py-2.5 rounded-full overflow-hidden group bg-transparent border border-white/20 text-white text-sm font-medium tracking-wider hover:border-white/60 transition-colors duration-300"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">Contact Me</span>
              {/* Button Inner Fill Effect */}
              <div className="absolute inset-0 h-full w-full bg-white scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="md:hidden text-white p-2 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-[1px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-[10px]' : ''}`} />
              <span className={`w-full h-[1px] bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-[1px] bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-[10px]' : ''}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center"
        style={{ clipPath: 'circle(0% at 90% 10%)' }}
      >
        <div className="flex flex-col space-y-8 text-center mt-10">
          {NAV_LINKS.map((link, index) => (
            <a 
              key={link.name} 
              href={link.href}
              ref={el => mobileLinksRef.current[index] = el}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-3xl font-light text-gray-400 hover:text-white transition-colors tracking-widest relative group"
            >
              {link.name}
              <span className="absolute -bottom-2 left-1/2 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4"></span>
            </a>
          ))}
          
          <button
            ref={el => mobileLinksRef.current[NAV_LINKS.length] = el}
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-8 px-8 py-3 rounded-full border border-white text-white tracking-widest hover:bg-white hover:text-black transition-all duration-300"
          >
            Contact Me
          </button>
        </div>
      </div>
    </>
  );
}
