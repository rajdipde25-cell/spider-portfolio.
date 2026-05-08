import React, { useEffect, useRef } from 'react';

const RefinedSnow = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let animationId;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const flakes = [];
    const flakeCount = 40; // Reduced from 80

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1,
        swing: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.01 + 0.005
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const audioBoost = window.audioIntensity || 0;

      flakes.forEach(f => {
        // Snow reacts to beat intensity
        f.y += f.speedY + (audioBoost * 3); 
        f.swing += f.swingSpeed;
        f.x += f.speedX + Math.sin(f.swing) * 0.1;

        if (f.y > height) {
          f.y = -5;
          f.x = Math.random() * width;
        }
        if (f.x > width) f.x = 0;
        if (f.x < 0) f.x = width;

        // Optimized drawing: simple circle instead of radial gradient
        ctx.beginPath();
        const currentOpacity = Math.min(f.opacity + audioBoost * 0.5, 0.8);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[60]"
      style={{ opacity: 0.5 }}
    />
  );
};

export default RefinedSnow;
