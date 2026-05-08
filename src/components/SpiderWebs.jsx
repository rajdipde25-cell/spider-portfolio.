import React, { useEffect, useRef } from 'react';

const SpiderWebs = () => {
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

    const nodes = [];
    const webShoots = [];
    const mouse = { x: -1000, y: -1000, radius: 200 };

    // Node class for the background mesh
    class Node {
      constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.friction = 0.95;
        this.spring = 0.05;
      }

      update() {
        const dxBase = this.baseX - this.x;
        const dyBase = this.baseY - this.y;
        this.vx += dxBase * this.spring;
        this.vy += dyBase * this.spring;

        const dxMouse = mouse.x - this.x;
        const dyMouse = mouse.y - this.y;
        const dist = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dyMouse, dxMouse);
          this.vx += Math.cos(angle) * force * 15;
          this.vy += Math.sin(angle) * force * 15;
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    // Realistic Web Shoot using Verlet Integration
    class WebShoot {
      constructor(startX, startY, targetX, targetY) {
        this.points = [];
        this.segments = 20;
        this.gravity = 0.15;
        this.friction = 0.98;
        this.alive = true;
        this.life = 1.0;
        this.stiffness = 0.8;

        const dx = (targetX - startX) / this.segments;
        const dy = (targetY - startY) / this.segments;

        // Create a chain of points
        for (let i = 0; i < this.segments; i++) {
          this.points.push({
            x: startX,
            y: startY,
            oldX: startX - dx * (i * 0.5), // Add initial velocity
            oldY: startY - dy * (i * 0.5),
            fixed: i === 0 // Anchor the first point to the origin
          });
        }

        // Projectile tip
        this.tip = { x: startX, y: startY, vx: dx * 1.5, vy: dy * 1.5 };
      }

      update() {
        if (!this.alive) return;

        // Move the tip towards target
        this.tip.x += this.tip.vx;
        this.tip.y += this.tip.vy;
        this.tip.vy += this.gravity * 0.5; // Tip also falls

        // Anchor the first point to the moving tip
        this.points[0].x = this.tip.x;
        this.points[0].y = this.tip.y;

        // Verlet Integration for each point
        for (let i = 0; i < this.points.length; i++) {
          const p = this.points[i];
          if (p.fixed && i !== 0) continue; // Keep origin fixed if we wanted

          const vx = (p.x - p.oldX) * this.friction;
          const vy = (p.y - p.oldY) * this.friction;

          p.oldX = p.x;
          p.oldY = p.y;
          p.x += vx;
          p.y += vy;
          p.y += this.gravity;
        }

        // Constraints (Link the points)
        for (let j = 0; j < 5; j++) { // Multiple passes for stability
          for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const targetDist = 5; // Length of each silk segment
            const difference = (targetDist - distance) / distance;
            const offsetX = dx * difference * 0.5;
            const offsetY = dy * difference * 0.5;

            if (i !== 0) { // Tip is essentially "driven"
              p1.x -= offsetX * this.stiffness;
              p1.y -= offsetY * this.stiffness;
            }
            p2.x += offsetX * this.stiffness;
            p2.y += offsetY * this.stiffness;
          }
        }

        this.life -= 0.005;
        if (this.life <= 0) this.alive = false;
      }

      draw() {
        if (!this.alive) return;

        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        // Draw smooth organic curve
        for (let i = 1; i < this.points.length - 1; i++) {
          const p = this.points[i];
          const next = this.points[i + 1];
          const xc = (p.x + next.x) / 2;
          const yc = (p.y + next.y) / 2;
          ctx.quadraticCurveTo(p.x, p.y, xc, yc);
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.life * 0.8})`;
        ctx.lineWidth = 2 * this.life;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Add a "core" red glow to the silk
        ctx.strokeStyle = `rgba(239, 68, 68, ${this.life * 0.4})`;
        ctx.lineWidth = 4 * this.life;
        ctx.stroke();
      }
    }

    // Initialize nodes
    const spacing = 150;
    for (let x = -spacing; x < width + spacing; x += spacing) {
      for (let y = -spacing; y < height + spacing; y += spacing) {
        nodes.push(new Node(x + (Math.random() - 0.5) * spacing, y + (Math.random() - 0.5) * spacing));
      }
    }

    const handleClick = (e) => {
      // Shoot web from bottom center
      webShoots.push(new WebShoot(width / 2, height, e.clientX, e.clientY));
      
      // Also shoot from side for extra "crazy" feel
      setTimeout(() => {
        webShoots.push(new WebShoot(0, height * 0.8, e.clientX, e.clientY));
      }, 50);
      setTimeout(() => {
        webShoots.push(new WebShoot(width, height * 0.8, e.clientX, e.clientY));
      }, 100);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background mesh update
      nodes.forEach(node => {
        node.update();
      });

      // Draw background web lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Update and Draw Web Shoots
      for (let i = webShoots.length - 1; i >= 0; i--) {
        const shoot = webShoots[i];
        shoot.update();
        shoot.draw();
        if (!shoot.alive) webShoots.splice(i, 1);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[70]"
      style={{ opacity: 0.8 }}
    />
  );
};

export default SpiderWebs;
