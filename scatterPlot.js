import { extent, scaleLinear, line } from 'd3';
import { axes } from './axes'

export const scatterPlot = (
    selection,
    { data, width, height, xValue, xLabel, yValue, yLabel, zValue, margin, title }
) => {
    const xScale = scaleLinear()
        .domain(extent(data, xValue))
        .range([margin.left, width - margin.right]);

    const yScale = scaleLinear()
        .domain(extent(data, yValue))
        .range([height - margin.bottom, margin.top]);

    selection.call(axes, { xScale, xLabel, yScale, yLabel, title })

    selection
        .selectAll('image')
        .data(data)
        .join('image')
        .transition()
        .attr('x', (d) => (xScale(xValue(d))) - 25)
        .attr('y', (d) => (yScale(yValue(d))) - 25)
        .attr('width', 50)
        .attr('height', 50)
        .attr('xling:href', (d) => zValue(d))
        ;
};
