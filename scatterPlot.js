import { select, extent, scaleLinear, line, pointer } from "d3";
import axes, { axisdestroy } from "./axes";
import tooltip from "./tooltips.js";

export const scatterdestroy = (selection) => {
  axisdestroy(selection);
};

export default function scatterPlot(
  selection,
  { data, width, height, xValue, xLabel, yValue, yLabel, zValue, margin, title }
) {
  const xScale = scaleLinear()
    //.domain(extent(data, xValue))
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([height - margin.bottom, margin.top]);

  selection.call(axes, { xScale, xLabel, yScale, yLabel, title });

  const imgs = selection
    .selectAll("image")
    .data(data)
    .join("image")
    .attr("width", 50)
    .attr("height", 50)
    .style("opacity", 0.7)
    .transition()
    .attr("x", (d) => xScale(xValue(d)) - 25)
    .attr("y", (d) => yScale(yValue(d)) - 25)
    .attr("xling:href", (d) => zValue(d));

  selection
    .selectAll("image")
    .call(tooltip, {
      parentSelection: selection,
      xValue,
      descriptorText: "This team has a home win percentage of: ",
    });
}
