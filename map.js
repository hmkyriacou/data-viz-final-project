import {
    geoAlbersUsa,
    geoPath
} from 'd3';


export const map = (selection, { data, team_data, width, height }) => {

    const projection = geoAlbersUsa().fitSize([width, height], data);
    const path = geoPath(projection);

    console.log(team_data)

    console.log(projection([
        -70.749016,
        40.2127753
    ]))
    console.log(projection([
        -71.249016,
        40.7127753
    ]))
    console.log(projection([
        -71.249016,
        40.7127753
    ]))

    selection
        .selectAll('image')
        .data(team_data)
        .join('image')
        .attr('x', (d) => projection([
            d.location.lng,
            d.location.lat
        ])[0])
        .attr('y', (d) => projection([
            d.location.lng,
            d.location.lat
        ])[1])
        .attr('width', 80)
        .attr('height', 80)
        .attr('xling:href', (d) => d.img)
        .attr("style", "transform: translate(-40px, -40px);")

    selection
        .selectAll('path.country')
        .data(data.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'country')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);
};
