import React, { useEffect, useRef } from 'react';

const WebCursorTrail = () => {
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

    const points = [];
    const maxPoints = 20;
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      points.push({
        x: mouse.x,
        y: mouse.y,
        life: 1,
        radius: 3
      });

      if (points.length > maxPoints) {
        points.shift();
      }
    };

    const handleClick = (e) => {
      // Web burst effect on click
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        points.push({
          x: e.clientX,
          y: e.clientY,
          life: 1,
          radius: 2,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          isParticle: true
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    const drawWebLine = (x1, y1, x2, y2, alpha) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Main line
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.6})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cross threads
      if (dist > 15) {
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const perpX = -dy / dist * 5;
        const perpY = dx / dist * 5;

        ctx.beginPath();
        ctx.moveTo(midX + perpX, midY + perpY);
        ctx.lineTo(midX - perpX, midY - perpY);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.life -= 0.025;

        if (p.isParticle) {
          p.x += p.vx || 0;
          p.y += p.vy || 0;
          p.vx *= 0.95;
          p.vy *= 0.95;
        }

        if (p.life <= 0) {
          points.splice(i, 1);
          continue;
        }

        // Draw point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${p.life * 0.8})`;
        ctx.fill();

        // Draw web connections to nearby points
        if (i > 0 && !p.isParticle) {
          const prev = points[i - 1];
          if (!prev.isParticle) {
            drawWebLine(p.x, p.y, prev.x, prev.y, p.life);
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-40"
    />
  );
};

export default WebCursorTrail;
