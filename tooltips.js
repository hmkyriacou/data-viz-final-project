import { select, pointer } from "d3";

export default function tooltip(
  selection,
  { xValue, descriptorText },
  eventListeners = {}
) {
  let Tooltip;
  let trect;
  let ttext;

  Tooltip = select(selection.node().parentNode)
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

  function mouseover(e, d) {
    Tooltip.style("opacity", 1);
    ttext.text(descriptorText + (xValue ? xValue(d).toFixed(2) : ""));
    trect.attr("width", ttext.node().getBBox().width + 10);
    if (eventListeners && eventListeners.mouseover) {
      eventListeners.mouseover(e, d);
    }
  }

  function mousemove(e, d) {
    Tooltip.attr(
      "transform",
      `translate(${pointer(e)[0]}, ${pointer(e)[1] - 20})`
    );
    if (eventListeners && eventListeners.mousemove) {
      eventListeners.mousemove(e, d);
    }
  }

  function mouseleave(e, d) {
    Tooltip.attr("transform", "translate(-100, -100)").style("opacity", 0);
    if (eventListeners && eventListeners.mouseleave) {
      eventListeners.mouseleave(e, d);
    }
  }

  selection
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  return selection;
}
