import {
    geoAlbersUsa,
    geoPath
} from 'd3';


export const map = (selection, { data, team_data, width, height }) => {
    
    const projection = geoAlbersUsa().fitSize([width, height], data);
    const path = geoPath(projection);
    
   //console.log(team_data)

   //console.log(projection)

   //   selection
   //      .selectAll('circle')
   //      .data(team_data)
   //      .join('circle')
   //      .attr('x', (d) => projection(d.location)[0])
   //      .attr('y', (d) => projection(d.location)[1])

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
