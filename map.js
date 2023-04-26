import {
  geoAlbersUsa,
  geoPath,
  interpolateTurbo,
  scaleOrdinal,
  schemeGnBu,
  schemeOrRd,
} from "d3";

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

  const climate_zone_list = Object.values(
    climate_zones.reduce((acc, obj, index) => {
      acc[`${obj.CLS}`] = acc[`${obj.CLS}`] || [];
      acc[`${obj.CLS}`].push(index);
      return acc;
    }, [])
  ).map((o) => {
    return climate_zones[o[0]].CLS;
  });

  const fipsToCls = new Map();
  for (const d of data.features) {
    fipsToCls.set(
      d.id,
      climate_zones.find((o) => {
        return o.FIPS === d.id;
      })?.CLS
    );
  }

  const colorScale = scaleOrdinal([
    "rgb(31, 119, 180)",
    "rgb(174, 199, 232)",
    "rgb(255, 127, 14)",
    "rgb(255, 187, 120)",
    "rgb(44, 160, 44)",
    "rgb(152, 223, 138)",
    "rgb(214, 39, 40)",
    "rgb(255, 152, 150)",
    "rgb(148, 103, 189)",
    "rgb(197, 176, 213)",
    "rgb(140, 86, 75)",
    "rgb(196, 156, 148)",
    "rgb(227, 119, 194)",
    "rgb(247, 182, 210)",
    "rgb(127, 127, 127)",
    "rgb(199, 199, 199)",
    "rgb(188, 189, 34)",
    "rgb(219, 219, 141)",
    "rgb(23, 190, 207)",
    "rgb(158, 218, 229)",
  ]).domain(climate_zone_list);

  // console.log(colorScale("Cfa"));

  // console.log(fipsToCls);

  selection
    .selectAll("path.country")
    .data(data.features)
    .join("path")
    .attr("d", path)
    .attr("class", "country")
    .attr("fill", (d) =>
      fipsToCls.get(d.id) ? colorScale(fipsToCls.get(d.id)) : "black"
    )
    .attr("stroke", (d) => colorScale(fipsToCls.get(d.id)))
    .attr("stroke-width", 0.5);

  const imgs = selection
    .selectAll("image")
    .data(team_data)
    .join("image")
    .style("opacity", (d) => (state.highlighted.includes(d.team) ? 1 : 0.5))
    .attr("x", (d) => projection([d.location.lng, d.location.lat])[0])
    .attr("y", (d) => projection([d.location.lng, d.location.lat])[1])
    .attr("width", (d) => (state.highlighted.includes(d.team) ? 50 : 30))
    .attr("height", (d) => (state.highlighted.includes(d.team) ? 50 : 30))
    .attr("xling:href", (d) => d.img)
    .style("transform", (d) =>
      state.highlighted.includes(d.team)
        ? "translate(-25px, -25px)"
        : "translate(-15px, -15px)"
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
