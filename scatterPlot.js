import { select, extent, scaleLinear, line, pointer } from "d3";
import axes, { axisdestroy } from "./axes";
import tooltip from "./tooltips.js";

export const scatterdestroy = (selection) => {
  axisdestroy(selection);
};

export default function scatterPlot(
  selection,
  {
    data,
    width,
    height,
    xValue,
    xLabel,
    yValue,
    yLabel,
    zValue,
    margin,
    title,
    state,
    setState,
  }
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
    .attr("width", (d) => (state.highlighted.includes(d.team) ? 50 : 25))
    .attr("height", (d) => (state.highlighted.includes(d.team) ? 50 : 25))
    .style("opacity", (d) => (state.highlighted.includes(d.team) ? 1 : 0.5));
  imgs
    .transition()
    .attr(
      "x",
      (d) =>
        xScale(xValue(d)) - (state.highlighted.includes(d.team) ? 25 : 12.5)
    )
    .attr(
      "y",
      (d) =>
        yScale(yValue(d)) - (state.highlighted.includes(d.team) ? 25 : 12.5)
    )
    .attr("xling:href", (d) => zValue(d));

  imgs.on("click", (e, d) => {
    state.highlighted.indexOf(d.team) === -1
      ? setState((prevState) => ({
          ...prevState,
          highlighted: state.highlighted.concat([d.team]),
        }))
      : setState((prevState) => ({
          ...prevState,
          highlighted: state.highlighted.filter((e) => {
            return e === d.team ? false : true;
          }),
        }));
  });

  imgs.call(tooltip, {
    xValue,
    descriptorText: "This team has a home win percentage of: ",
  });
}
