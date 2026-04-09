import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GlobeProps {
  threatLevel: number;
}

export const Globe: React.FC<GlobeProps> = ({ threatLevel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) * 0.4;
    
    let rotation = 0;
    let mouseX = 0;
    let mouseY = 0;
    let animationFrame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // Generate some random threat points
    const threatPoints = d3.range(30).map(() => ({
      phi: Math.random() * Math.PI * 2,
      theta: Math.random() * Math.PI,
      size: Math.random() * 4 + 1,
      pulse: Math.random() * Math.PI,
      id: Math.random()
    }));

    // Generate some arcs between points
    const arcs = d3.range(10).map(() => ({
      start: threatPoints[Math.floor(Math.random() * threatPoints.length)],
      end: threatPoints[Math.floor(Math.random() * threatPoints.length)],
      progress: Math.random(),
      speed: 0.01 + Math.random() * 0.02
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      rotation += 0.003 + (mouseX * 0.01);

      // Draw Atmospheric Glow
      const atmosphere = ctx.createRadialGradient(width/2, height/2, radius, width/2, height/2, radius * 1.3);
      atmosphere.addColorStop(0, 'rgba(255, 176, 0, 0.1)');
      atmosphere.addColorStop(0.5, 'rgba(255, 176, 0, 0.02)');
      atmosphere.addColorStop(1, 'rgba(255, 176, 0, 0)');
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(width/2, height/2, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe Base
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw Grid Lines (Meridians)
      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + rotation;
        const xRadius = Math.cos(angle) * radius;
        
        ctx.beginPath();
        ctx.ellipse(width / 2, height / 2, Math.abs(xRadius), radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 176, 0, ${Math.abs(xRadius) / radius * 0.1})`;
        ctx.stroke();
      }

      // Draw Grid Lines (Parallels)
      for (let i = 1; i < 9; i++) {
        const y = height / 2 + (i / 9 - 0.5) * 2 * radius;
        const r = Math.sqrt(radius * radius - Math.pow(y - height / 2, 2));
        
        ctx.beginPath();
        ctx.ellipse(width / 2, y, r, r * 0.1, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 176, 0, 0.05)';
        ctx.stroke();
      }

      // Draw Arcs
      arcs.forEach(arc => {
        arc.progress = (arc.progress + arc.speed) % 1;
        const startRot = rotation + arc.start.phi;
        const endRot = rotation + arc.end.phi;
        
        const x1 = width / 2 + radius * Math.sin(arc.start.theta) * Math.cos(startRot);
        const y1 = height / 2 + radius * Math.cos(arc.start.theta);
        const z1 = radius * Math.sin(arc.start.theta) * Math.sin(startRot);

        const x2 = width / 2 + radius * Math.sin(arc.end.theta) * Math.cos(endRot);
        const y2 = height / 2 + radius * Math.cos(arc.end.theta);
        const z2 = radius * Math.sin(arc.end.theta) * Math.sin(endRot);

        if (z1 > 0 && z2 > 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          // Quadratic curve for arc
          const cx = (x1 + x2) / 2;
          const cy = (y1 + y2) / 2 - 50;
          ctx.quadraticCurveTo(cx, cy, x2, y2);
          ctx.strokeStyle = 'rgba(255, 176, 0, 0.1)';
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw moving pulse on arc
          const t = arc.progress;
          const px = (1-t)*(1-t)*x1 + 2*(1-t)*t*cx + t*t*x2;
          const py = (1-t)*(1-t)*y1 + 2*(1-t)*t*cy + t*t*y2;
          
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = '#00F0FF';
          ctx.fill();
        }
      });

      // Draw Threat Points
      threatPoints.forEach(p => {
        p.pulse += 0.05;
        const currentRotation = rotation + p.phi;
        const x = width / 2 + radius * Math.sin(p.theta) * Math.cos(currentRotation);
        const y = height / 2 + radius * Math.cos(p.theta);
        const z = radius * Math.sin(p.theta) * Math.sin(currentRotation);

        if (z > 0) {
          const opacity = (z / radius);
          const pulseSize = p.size * (1 + Math.sin(p.pulse) * 0.5);
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(x, y, pulseSize * 3, 0, Math.PI * 2);
          ctx.fillStyle = threatLevel > 70 ? `rgba(255, 49, 49, ${opacity * 0.1})` : `rgba(255, 176, 0, ${opacity * 0.1})`;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = threatLevel > 70 ? `rgba(255, 49, 49, ${opacity})` : `rgba(255, 176, 0, ${opacity})`;
          ctx.fill();

          // Spike
          if (threatLevel > 40) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - (pulseSize * 8 * (threatLevel / 100)));
            ctx.strokeStyle = threatLevel > 70 ? `rgba(255, 49, 49, ${opacity * 0.8})` : `rgba(255, 176, 0, ${opacity * 0.8})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [threatLevel]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} 
        className="w-full h-full max-w-[500px] max-h-[500px]"
      />
      <div className="absolute top-4 left-4 border-l border-amber-neon/30 pl-2">
        <div className="text-[8px] uppercase tracking-widest opacity-50">Global Threat Map</div>
        <div className="text-[10px] font-bold">LIVE TELEMETRY</div>
      </div>
    </div>
  );
};
