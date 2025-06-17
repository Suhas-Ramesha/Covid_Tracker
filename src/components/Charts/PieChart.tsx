import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface PieChartData {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  width?: number;
  height?: number;
  title?: string;
}

export function PieChart({ 
  data, 
  width = 400, 
  height = 400, 
  title = "Pie Chart" 
}: PieChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const radius = Math.min(width, height) / 2 - 40;
    const colors = d3.scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']);

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<PieChartData>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius);

    const labelArc = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 0.6);

    const arcs = g.selectAll('.arc')
      .data(pie(data))
      .enter().append('g')
      .attr('class', 'arc');

    // Add slices
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color || colors(d.data.label) as string)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .style('opacity', 1)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', 'white')
      .text(d => {
        const percentage = ((d.value / d3.sum(data, d => d.value)) * 100).toFixed(1);
        return `${percentage}%`;
      })
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay(800)
      .style('opacity', 1);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 20)`);

    const legendItems = legend.selectAll('.legend-item')
      .data(data)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`);

    legendItems.append('rect')
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', d => d.color || colors(d.label) as string);

    legendItems.append('text')
      .attr('x', 20)
      .attr('y', 10)
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d.label);

  }, [data, width, height]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-auto"
        viewBox={`0 0 ${width} ${height}`}
      />
    </motion.div>
  );
}