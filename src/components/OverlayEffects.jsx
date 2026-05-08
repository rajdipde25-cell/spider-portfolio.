import React from 'react';

const OverlayEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {/* Scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%'
        }}
      />

      {/* Snow Gradient / Frosty Vignette */}
      <div 
        className="absolute inset-0 opacity-[0.2] mix-blend-screen audio-reactive"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(200, 235, 255, 0.2) 80%, rgba(255, 255, 255, 0.3) 100%)'
        }}
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />

      {/* Grain / Noise Texture - Optimized */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Spider-Sense Pulse - Refined & Rhythmic */}
      <div className="absolute inset-0 pointer-events-none z-[110]">
        <div className="absolute inset-0 animate-sense-pulse bg-red-600/5 opacity-0" />
        <div className="absolute inset-0 audio-reactive opacity-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.05) 0%, transparent 70%)' }} />
      </div>


      {/* Corner RGB Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/10 blur-[120px] translate-x-1/3 translate-y-1/3" />
      
      {/* Glitchy "Web" Line occasionally flickering */}
      <div className="absolute top-[10%] left-0 w-full h-px bg-red-500/20 animate-pulse opacity-20" style={{ animationDuration: '0.1s' }} />
    </div>
  );
};

export default OverlayEffects;
