import { select, pointer } from "d3";

export default function tooltip(selection, { xValue }) {
  let Tooltip;
  let trect;
  let ttext;

  tooltip.mouseover = function (e, d) {
    Tooltip.style("opacity", 1);
    ttext.text(
      "This team has a home win percentage of: " + xValue(d).toFixed(2)
    );
    trect.attr("width", ttext.node().getBBox().width + 10);
    select(this).style("stroke", "black").style("opacity", 1);
  };
  tooltip.mousemove = function (e, d) {
    console.log(e);
    Tooltip.attr(
      "transform",
      `translate(${pointer(e, selection)[0]}, ${
        pointer(e, selection)[1] - 100
      })`
    );
  };
  tooltip.mouseleave = function (e, d) {
    Tooltip.attr("transform", "translate(-100, -100)").style("opacity", 0);
    select(this).style("stroke", "none").style("opacity", 0.7);
  };

  Tooltip = selection
    .selectAll("g.Tooltip")
    .data([null])
    .join("g")
    .attr("class", "Tooltip")
    .style("opacity", 0);

  trect = Tooltip.selectAll("rect.Tooltip")
    .data([null])
    .join("rect")
    .attr("class", "Tooltip")
    .attr("fill", "white")
    .attr("width", 1)
    .attr("height", 25)
    .attr("transform", "translate(-5,-20)")
    .attr("stroke", "black");

  ttext = Tooltip.selectAll("text.Tooltip")
    .data([null])
    .join("text")
    .attr("class", "Tooltip")
    .attr("font-size", 20);

  return tooltip;
}
