import { geoAlbersUsa, geoPath, schemeRdBu, scaleSequential } from "d3";

import tooltip from "./tooltips";

export const mapdestroy = (selection) => {
  selection.selectAll("path.country").remove();
};

export default function map(
  selection,
  { data, team_data, width, height, xValue, state, setState, climate_zones }
) {
  const projection = geoAlbersUsa().fitSize([width, height], data);
  const path = geoPath(projection);

  const colorScale = scaleSequential(schemeRdBu).domain([0, 30]);

  console.log(colorScale(15));

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
    .style("opacity", (d) => (state.highlighted.includes(d.team) ? 1 : 0.5))
    .attr("x", (d) => projection([d.location.lng, d.location.lat])[0])
    .attr("y", (d) => projection([d.location.lng, d.location.lat])[1])
    .attr("width", (d) => (state.highlighted.includes(d.team) ? 40 : 20))
    .attr("height", (d) => (state.highlighted.includes(d.team) ? 40 : 20))
    .attr("xling:href", (d) => d.img)
    .style("transform", (d) =>
      state.highlighted.includes(d.team)
        ? "translate(-20px, -20px)"
        : "translate(-10px, -10px)"
    );

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
