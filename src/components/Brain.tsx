import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface BrainProps {
  threatLevel: number;
  isEngaging: boolean;
}

export const Brain: React.FC<BrainProps> = ({ threatLevel, isEngaging }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const updateSize = () => {
      const rect = svgRef.current?.parentElement?.getBoundingClientRect();
      if (rect) {
        const size = Math.min(rect.width, rect.height);
        d3.select(svgRef.current)
          .attr('width', size)
          .attr('height', size);
        return size;
      }
      return 400;
    };

    const size = updateSize();
    const center = { x: size / 2, y: size / 2 };

    // Add multiple layers of glowing particles
    const particles = d3.range(300).map(i => ({
      id: i,
      x: center.x + (Math.random() - 0.5) * size * 1.5,
      y: center.y + (Math.random() - 0.5) * size * 1.5,
      size: Math.random() * 2,
      speed: Math.random() * 0.02,
      color: Math.random() > 0.5 ? '#FFB000' : '#00F0FF'
    }));

    const particleElements = svg.append('g')
      .selectAll('circle.particle')
      .data(particles)
      .enter()
      .append('circle')
      .attr('class', 'particle')
      .attr('r', d => d.size)
      .attr('fill', d => d.color)
      .attr('opacity', 0.15);

    d3.timer((elapsed) => {
      particleElements
        .attr('transform', d => {
          const angle = elapsed * d.speed;
          const dx = Math.cos(angle) * 30;
          const dy = Math.sin(angle) * 30;
          return `translate(${dx}, ${dy})`;
        });
    });

    // Create a pulsing neural grid
    const nodes = d3.range(200).map(i => ({
      id: i,
      x: center.x + (Math.random() - 0.5) * size * 0.8,
      y: center.y + (Math.random() - 0.5) * size * 0.8,
      group: Math.floor(Math.random() * 6)
    }));

    const links = d3.range(350).map(() => ({
      source: Math.floor(Math.random() * 200),
      target: Math.floor(Math.random() * 200),
    }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).distance(size * 0.15))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(center.x, center.y))
      .force('collision', d3.forceCollide().radius(12))
      .on('tick', () => {
        linkElements
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        nodeElements
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
          
        glowElements
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y);
      });

    const linkElements = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', isEngaging ? '#FF1F1F' : '#FFB000')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.1);

    const glowElements = svg.append('g')
      .selectAll('circle.glow')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'glow')
      .attr('r', 10)
      .attr('fill', isEngaging ? '#FF1F1F' : '#FFB000')
      .attr('opacity', 0.04);

    const nodeElements = svg.append('g')
      .selectAll('circle.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d: any) => d.group === 0 ? 8 : 3)
      .attr('fill', (d: any) => {
        if (isEngaging) return '#FF1F1F';
        if (d.group === 0) return '#FFB000';
        if (d.group === 1) return '#00F0FF';
        if (d.group === 2) return '#FFFFFF';
        return 'transparent';
      })
      .attr('stroke', (d: any) => d.group === 3 ? '#FFB000' : 'none')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8)
      .attr('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(400)
          .attr('r', 20)
          .attr('opacity', 1)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 3);
        
        svg.append('text')
          .attr('id', `label-${d.id}`)
          .attr('x', d.x + 25)
          .attr('y', d.y)
          .attr('fill', '#FFFFFF')
          .attr('font-size', '14px')
          .attr('font-family', 'JetBrains Mono')
          .attr('font-weight', '800')
          .attr('letter-spacing', '0.15em')
          .text(`CORE_0x${d.id.toString(16).toUpperCase()}`);
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(400)
          .attr('r', d.group === 0 ? 8 : 3)
          .attr('opacity', 0.8)
          .attr('stroke', d.group === 3 ? '#FFB000' : 'none')
          .attr('stroke-width', 1.5);
        
        svg.select(`#label-${d.id}`).remove();
      });

    // Add orbit rings with different speeds and directions
    const orbits = [size * 0.3, size * 0.4, size * 0.5, size * 0.6];
    orbits.forEach((r, i) => {
      svg.append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', i % 2 === 0 ? '#FFB000' : '#00F0FF')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', i % 2 === 0 ? '4,16' : '2,10')
        .attr('opacity', 0.08)
        .append('animateTransform')
        .attr('attributeName', 'transform')
        .attr('type', 'rotate')
        .attr('from', `0 ${center.x} ${center.y}`)
        .attr('to', `${i % 2 === 0 ? 360 : -360} ${center.x} ${center.y}`)
        .attr('dur', `${25 + i * 10}s`)
        .attr('repeatCount', 'indefinite');
    });

    // Add a complex central glowing sphere with multiple gradients
    const defs = svg.append('defs');
    
    const coreGrad = defs.append('radialGradient')
      .attr('id', 'core-grad-main')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    coreGrad.append('stop').attr('offset', '0%').attr('stop-color', isEngaging ? '#FF1F1F' : '#FFB000').attr('stop-opacity', 0.7);
    coreGrad.append('stop').attr('offset', '70%').attr('stop-color', isEngaging ? '#FF1F1F' : '#FFB000').attr('stop-opacity', 0.15);
    coreGrad.append('stop').attr('offset', '100%').attr('stop-color', isEngaging ? '#FF1F1F' : '#FFB000').attr('stop-opacity', 0);

    const innerGrad = defs.append('radialGradient')
      .attr('id', 'core-grad-inner')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    innerGrad.append('stop').attr('offset', '0%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 0.5);
    innerGrad.append('stop').attr('offset', '100%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 0);

    svg.append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', size * 0.35)
      .attr('fill', 'url(#core-grad-main)')
      .attr('class', 'animate-pulse');

    svg.append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', size * 0.1)
      .attr('fill', 'url(#core-grad-inner)')
      .style('filter', 'blur(15px)');

    return () => simulation.stop();
  }, [threatLevel, isEngaging]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width="400" height="400" className="filter drop-shadow-[0_0_15px_rgba(255,176,0,0.3)]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-[10px] uppercase tracking-[0.3em] opacity-50 animate-pulse">
          Neural Core Active
        </div>
      </div>
    </div>
  );
};
