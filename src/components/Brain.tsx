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

    const width = 400;
    const height = 400;
    const center = { x: width / 2, y: height / 2 };

    // Add multiple layers of glowing particles
    const particles = d3.range(200).map(i => ({
      id: i,
      x: center.x + (Math.random() - 0.5) * 600,
      y: center.y + (Math.random() - 0.5) * 600,
      size: Math.random() * 2,
      speed: Math.random() * 0.02
    }));

    const particleElements = svg.append('g')
      .selectAll('circle.particle')
      .data(particles)
      .enter()
      .append('circle')
      .attr('class', 'particle')
      .attr('r', d => d.size)
      .attr('fill', '#FFFFFF')
      .attr('opacity', 0.2);

    d3.timer((elapsed) => {
      particleElements
        .attr('transform', d => {
          const angle = elapsed * d.speed;
          const dx = Math.cos(angle) * 20;
          const dy = Math.sin(angle) * 20;
          return `translate(${dx}, ${dy})`;
        });
    });

    // Create a pulsing neural grid
    const nodes = d3.range(150).map(i => ({
      id: i,
      x: center.x + (Math.random() - 0.5) * 500,
      y: center.y + (Math.random() - 0.5) * 500,
      group: Math.floor(Math.random() * 5)
    }));

    const links = d3.range(250).map(() => ({
      source: Math.floor(Math.random() * 150),
      target: Math.floor(Math.random() * 150),
    }));

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).distance(50))
      .force('charge', d3.forceManyBody().strength(-80))
      .force('center', d3.forceCenter(center.x, center.y))
      .force('collision', d3.forceCollide().radius(10))
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
      .attr('opacity', 0.08);

    const glowElements = svg.append('g')
      .selectAll('circle.glow')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'glow')
      .attr('r', 8)
      .attr('fill', isEngaging ? '#FF1F1F' : '#FFB000')
      .attr('opacity', 0.03);

    const nodeElements = svg.append('g')
      .selectAll('circle.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d: any) => d.group === 0 ? 6 : 2)
      .attr('fill', (d: any) => {
        if (isEngaging) return '#FF1F1F';
        if (d.group === 0) return '#FFB000';
        if (d.group === 1) return '#00F0FF';
        if (d.group === 2) return '#FFFFFF';
        return 'transparent';
      })
      .attr('stroke', (d: any) => d.group === 3 ? '#FFB000' : 'none')
      .attr('stroke-width', 1)
      .attr('opacity', 0.7)
      .attr('cursor', 'pointer')
      .on('mouseover', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(400)
          .attr('r', 15)
          .attr('opacity', 1)
          .attr('stroke', '#FFFFFF')
          .attr('stroke-width', 2);
        
        svg.append('text')
          .attr('id', `label-${d.id}`)
          .attr('x', d.x + 20)
          .attr('y', d.y)
          .attr('fill', '#FFFFFF')
          .attr('font-size', '12px')
          .attr('font-family', 'JetBrains Mono')
          .attr('font-weight', '800')
          .attr('letter-spacing', '0.1em')
          .text(`CORE_0x${d.id.toString(16).toUpperCase()}`);
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this)
          .transition()
          .duration(400)
          .attr('r', d.group === 0 ? 6 : 2)
          .attr('opacity', 0.7)
          .attr('stroke', d.group === 3 ? '#FFB000' : 'none')
          .attr('stroke-width', 1);
        
        svg.select(`#label-${d.id}`).remove();
      });

    // Add orbit rings with different speeds and directions
    const orbits = [150, 200, 250, 300];
    orbits.forEach((r, i) => {
      svg.append('circle')
        .attr('cx', center.x)
        .attr('cy', center.y)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', i % 2 === 0 ? '#FFB000' : '#00F0FF')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', i % 2 === 0 ? '4,12' : '2,8')
        .attr('opacity', 0.05)
        .append('animateTransform')
        .attr('attributeName', 'transform')
        .attr('type', 'rotate')
        .attr('from', `0 ${center.x} ${center.y}`)
        .attr('to', `${i % 2 === 0 ? 360 : -360} ${center.x} ${center.y}`)
        .attr('dur', `${20 + i * 8}s`)
        .attr('repeatCount', 'indefinite');
    });

    // Add a complex central glowing sphere with multiple gradients
    const defs = svg.append('defs');
    
    const coreGrad = defs.append('radialGradient')
      .attr('id', 'core-grad-main')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    coreGrad.append('stop').attr('offset', '0%').attr('stop-color', isEngaging ? '#FF1F1F' : '#FFB000').attr('stop-opacity', 0.6);
    coreGrad.append('stop').attr('offset', '70%').attr('stop-color', isEngaging ? '#FF1F1F' : '#FFB000').attr('stop-opacity', 0.1);
    coreGrad.append('stop').attr('offset', '100%').attr('stop-color', isEngaging ? '#FF1F1F' : '#FFB000').attr('stop-opacity', 0);

    const innerGrad = defs.append('radialGradient')
      .attr('id', 'core-grad-inner')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    innerGrad.append('stop').attr('offset', '0%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 0.4);
    innerGrad.append('stop').attr('offset', '100%').attr('stop-color', '#FFFFFF').attr('stop-opacity', 0);

    svg.append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', 150)
      .attr('fill', 'url(#core-grad-main)')
      .attr('class', 'animate-pulse');

    svg.append('circle')
      .attr('cx', center.x)
      .attr('cy', center.y)
      .attr('r', 40)
      .attr('fill', 'url(#core-grad-inner)')
      .style('filter', 'blur(10px)');

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
