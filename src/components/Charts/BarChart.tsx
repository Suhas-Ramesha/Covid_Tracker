import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  title?: string;
}

export function BarChart({ 
  data, 
  width = 600, 
  height = 400, 
  title = "Bar Chart" 
}: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-45)');

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(',d')));

    // Add bars
    g.selectAll('.bar')
      .data(data)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.label) || 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .attr('fill', d => d.color || '#3B82F6')
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('y', d => yScale(d.value))
      .attr('height', d => innerHeight - yScale(d.value));

    // Add value labels on bars
    g.selectAll('.label')
      .data(data)
      .enter().append('text')
      .attr('class', 'label')
      .attr('x', d => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', '#374151')
      .text(d => d3.format(',')(d.value))
      .style('opacity', 0)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100 + 500)
      .style('opacity', 1);

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