import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Web canvas background for contact section
const ContactWebBg = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let animationId;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = [];
    const nodeCount = 30;
    const mouse = { x: -1000, y: -1000 };

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.3 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.02;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          node.x += dx * 0.005;
          node.y += dy * 0.005;
        }

        const currentAlpha = node.alpha * (0.7 + Math.sin(node.pulse) * 0.3);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${currentAlpha})`;
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(239, 68, 68, ${(1 - dist / 120) * 0.12})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        const mdx = mouse.x - nodes[i].x;
        const mdy = mouse.y - nodes[i].y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 150) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - mDist / 150) * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Select all animatable elements
      const elements = sectionRef.current.querySelectorAll('.animate-element');
      
      // Stagger them fading directly upward
      tl.fromTo(elements,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
      );
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Insert actual send behavior here later
    alert("Thank you for reaching out! I will get back to you soon.");
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#030303] flex items-center justify-center py-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Web Background Canvas */}
      <ContactWebBg />

      {/* Intense Background Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
        <div className="w-[800px] h-[500px] bg-red-600/10 rounded-full blur-[150px] mix-blend-screen opacity-50" />
      </div>

      {/* Web corner decorations */}
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none opacity-25 z-5">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0 100 L100 100 L100 0" fill="none" stroke="rgba(239,68,68,0.6)" strokeWidth="0.5"/>
          <path d="M0 100 L50 50 L100 0" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="0.3"/>
          <path d="M0 80 L50 50 L80 0" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="0.3"/>
          <path d="M0 60 L50 50 L60 0" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.3"/>
          <path d="M0 40 L50 50 L40 0" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="0.3"/>
          <path d="M20 20 Q30 30 40 40" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.3"/>
          <path d="M30 30 Q40 40 50 50" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="0.3"/>
          <circle cx="50" cy="50" r="2" fill="rgba(239,68,68,0.8)"/>
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none opacity-25 z-5" style={{ transform: 'scaleX(-1)' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M0 100 L100 100 L100 0" fill="none" stroke="rgba(239,68,68,0.6)" strokeWidth="0.5"/>
          <path d="M0 100 L50 50 L100 0" fill="none" stroke="rgba(239,68,68,0.4)" strokeWidth="0.3"/>
          <path d="M0 80 L50 50 L80 0" fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="0.3"/>
          <path d="M0 60 L50 50 L60 0" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="0.3"/>
          <path d="M0 40 L50 50 L40 0" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="0.3"/>
          <circle cx="50" cy="50" r="2" fill="rgba(239,68,68,0.8)"/>
        </svg>
      </div>

      <div className="max-w-2xl w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Header Block */}
        <div className="mb-12 animate-element">
          <p className="text-red-500 font-mono text-sm tracking-[0.3em] uppercase font-bold mb-4">
            [ Get in Touch ]
          </p>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white font-sans leading-none mb-6 drop-shadow-xl">
            Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-serif italic pr-2">Connect</span>
          </h2>
          <p className="text-gray-400 font-light text-lg tracking-wide leading-relaxed max-w-xl mx-auto">
            Open to opportunities in e-commerce, category management, and FMCG operations. Whether you want to discuss a role, a project, or just exchange ideas—reach out.
          </p>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 w-full animate-element">
          <a href="tel:+919563509027" className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-white/10 transition-all duration-300 group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 group-hover:text-red-300 transition-colors">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
              <p className="text-white text-sm font-medium">+91 95635 09027</p>
            </div>
          </a>
          <a href="mailto:rajdipde25@imi-k.edu.in" className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-white/10 transition-all duration-300 group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 group-hover:text-red-300 transition-colors">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-white text-sm font-medium">rajdipde25@imi-k.edu.in</p>
            </div>
          </a>
          <a href="https://linkedin.com/in/rajdip-de-sarkar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-red-500/30 hover:bg-white/10 transition-all duration-300 group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 group-hover:text-red-300 transition-colors">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">LinkedIn</p>
              <p className="text-white text-sm font-medium">linkedin.com/in/rajdip-de-sarkar</p>
            </div>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Location</p>
              <p className="text-white text-sm font-medium">Kolkata, India</p>
            </div>
          </div>
        </div>

        {/* Form Block */}
        <form ref={formRef} onSubmit={handleSubmit} className="w-full flex flex-col space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div className="relative group animate-element">
              <input 
                type="text" 
                id="name"
                required
                className="peer w-full bg-white/5 border border-white/5 text-white text-base rounded-xl px-5 py-4 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] placeholder-transparent"
                placeholder="Name"
              />
              <label htmlFor="name" className="absolute left-5 top-4 text-gray-500 text-base pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-red-400 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gray-400 bg-[#030303] px-1 rounded">
                Name
              </label>
            </div>
            
            {/* Email Input */}
            <div className="relative group animate-element">
              <input 
                type="email" 
                id="email"
                required
                className="peer w-full bg-white/5 border border-white/5 text-white text-base rounded-xl px-5 py-4 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] placeholder-transparent"
                placeholder="Email"
              />
              <label htmlFor="email" className="absolute left-5 top-4 text-gray-500 text-base pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-red-400 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gray-400 bg-[#030303] px-1 rounded">
                Email
              </label>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="relative group animate-element">
            <textarea 
              id="message"
              required
              rows="5"
              className="peer w-full bg-white/5 border border-white/5 text-white text-base rounded-xl px-5 py-4 outline-none transition-all duration-300 focus:bg-white/10 focus:border-red-500/50 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] placeholder-transparent resize-none"
              placeholder="Message"
            ></textarea>
            <label htmlFor="message" className="absolute left-5 top-4 text-gray-500 text-base pointer-events-none transition-all duration-300 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-red-400 peer-valid:-top-3 peer-valid:text-xs peer-valid:text-gray-400 bg-[#030303] px-1 rounded">
              Message
            </label>
          </div>

          {/* Submit Button */}
          <div className="animate-element pt-4 flex justify-center">
            <button 
              type="submit" 
              className="relative group overflow-hidden rounded-full w-full md:w-auto px-12 py-4 border border-red-500/30 bg-black text-white text-sm uppercase tracking-[0.2em] font-medium transition-all duration-500 hover:scale-[1.02] hover:border-red-500 shadow-[0_0_0_rgba(239,68,68,0)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              {/* Animated Inner Sweep */}
              <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <span className="relative z-10 flex items-center justify-center space-x-3">
                <span>Send Message</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 text-red-500">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </span>
            </button>
          </div>
          
        </form>
      </div>

      {/* Tailwind config hack config for custom shimmer keyframe. A real project injects this in index.css or tailwind.config.js - we can shim it inline cleanly here */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </section>
  );
}
