import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

export const ForensicBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 42;
    const particles: Particle[] = [];
    const colors = ['#00f2fe', '#38bdf8', '#818cf8', '#6366f1'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1,
        alpha: Math.random() * 0.4 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // Biometric scanning reticle & scanline variables
    let scanY = 0;
    let scanDirection = 1;
    let scanSpeed = 0.55;
    let scanPulse = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle forensic grid
      const gridSize = 48;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.025)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 2. Slow forensic scanning line
      scanY += scanSpeed * scanDirection;
      if (scanY > height) {
        scanY = height;
        scanDirection = -1;
      } else if (scanY < 0) {
        scanY = 0;
        scanDirection = 1;
      }

      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(0, 242, 254, 0)');
      scanGrad.addColorStop(0.5, 'rgba(0, 242, 254, 0.045)');
      scanGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, width, 60);

      // Fine bright laser line
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();

      // 3. Subtle AI biometric scan wireframe in top-right ambient background
      scanPulse += 0.02;
      const faceCenterX = width - 180;
      const faceCenterY = 180;
      if (width > 900) {
        ctx.save();
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.04 + Math.sin(scanPulse) * 0.02})`;
        ctx.lineWidth = 1;

        // Circular reticle
        ctx.beginPath();
        ctx.arc(faceCenterX, faceCenterY, 90, 0, Math.PI * 2);
        ctx.stroke();

        // Inner dashed ring
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(faceCenterX, faceCenterY, 65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Biometric facial wireframe nodes
        const faceLandmarks = [
          { x: 0, y: -30 },
          { x: -25, y: -20 },
          { x: 25, y: -20 },
          { x: 0, y: 0 },
          { x: 0, y: 15 },
          { x: -20, y: 35 },
          { x: 20, y: 35 },
          { x: 0, y: 40 },
          { x: 0, y: 60 },
          { x: -45, y: 20 },
          { x: 45, y: 20 },
        ];

        // Draw node points
        for (const pt of faceLandmarks) {
          ctx.fillStyle = 'rgba(0, 242, 254, 0.12)';
          ctx.beginPath();
          ctx.arc(faceCenterX + pt.x, faceCenterY + pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 4. Moving particles & neural interconnects
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 110) * 0.12;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
};
