import { geoAlbersUsa, geoPath } from "d3";

import tooltip from "./tooltips";

export const mapdestroy = (selection) => {
  selection.selectAll("path.country").remove();
};

export default function map(
  selection,
  { data, team_data, width, height, xValue }
) {
  const projection = geoAlbersUsa().fitSize([width, height], data);
  const path = geoPath(projection);

  selection
    .selectAll("path.country")
    .data(data.features)
    .join("path")
    .attr("d", path)
    .attr("class", "country")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  const imgs = selection
    .selectAll("image")
    .data(team_data)
    .join("image")
    .style("opacity", 0.7)
    .attr("x", (d) => projection([d.location.lng, d.location.lat])[0])
    .attr("y", (d) => projection([d.location.lng, d.location.lat])[1])
    .attr("width", 80)
    .attr("height", 80)
    .attr("xling:href", (d) => d.img)
    .style("transform", "translate(-40px, -40px)");

  imgs.call(tooltip, {
    xValue,
    descriptorText: "This team has a home win percentage of: ",
  });
}
