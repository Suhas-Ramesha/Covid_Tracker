import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

interface DataPoint {
  date: string;
  deaths: number;
  cases: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  showCases?: boolean;
  showDeaths?: boolean;
}

export function LineChart({ 
  data, 
  width = 800, 
  height = 400, 
  showCases = true, 
  showDeaths = true 
}: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 80, bottom: 40, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map(d => ({
      ...d,
      date: parseDate(d.date) || new Date()
    }));

    const xScale = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(formattedData, d => Math.max(d.deaths, d.cases)) || 0])
      .range([innerHeight, 0]);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %Y')))
      .selectAll('text')
      .style('fill', 'currentColor');

    g.append('g')
      .call(d3.axisLeft(yScale).tickFormat(d3.format(',d')))
      .selectAll('text')
      .style('fill', 'currentColor');

    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (innerHeight / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text('Count');

    g.append('text')
      .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'currentColor')
      .text('Date');

    // Line generators
    const deathsLine = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.deaths))
      .curve(d3.curveMonotoneX);

    const casesLine = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.cases))
      .curve(d3.curveMonotoneX);

    // Add lines
    if (showDeaths) {
      const deathsPath = g.append('path')
        .datum(formattedData)
        .attr('fill', 'none')
        .attr('stroke', '#EF4444')
        .attr('stroke-width', 2)
        .attr('d', deathsLine);

      // Animate line drawing
      const totalLength = deathsPath.node()?.getTotalLength() || 0;
      deathsPath
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
    }

    if (showCases) {
      const casesPath = g.append('path')
        .datum(formattedData)
        .attr('fill', 'none')
        .attr('stroke', '#3B82F6')
        .attr('stroke-width', 2)
        .attr('d', casesLine);

      // Animate line drawing
      const totalLength = casesPath.node()?.getTotalLength() || 0;
      casesPath
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .delay(500)
        .attr('stroke-dashoffset', 0);
    }

    // Add legend
    const legend = g.append('g')
      .attr('transform', `translate(${innerWidth - 60}, 20)`);

    if (showDeaths) {
      legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', '#EF4444');

      legend.append('text')
        .attr('x', 20)
        .attr('y', 10)
        .style('font-size', '12px')
        .style('fill', 'currentColor')
        .text('Deaths');
    }

    if (showCases) {
      legend.append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', '#3B82F6');

      legend.append('text')
        .attr('x', 20)
        .attr('y', 30)
        .style('font-size', '12px')
        .style('fill', 'currentColor')
        .text('Cases');
    }

  }, [data, width, height, showCases, showDeaths]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">COVID-19 Trends Over Time</h3>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-auto text-gray-600 dark:text-gray-300"
        viewBox={`0 0 ${width} ${height}`}
      />
    </motion.div>
  );
}