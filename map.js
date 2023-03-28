import {
    geoAlbersUsa,
    geoPath
} from 'd3';
import { pieimg } from './pie';


export const map = (selection, { data, team_data, width, height, xValue }) => {

    const projection = geoAlbersUsa().fitSize([width, height], data);
    const path = geoPath(projection);

    for (const team of team_data) {
        const [x, y] = projection([team.location.lng, team.location.lat])
        team.x = x
        team.y = y
    }

    selection
        .selectAll('path.country')
        .data(data.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'country')
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5);

    selection
        .call(pieimg, {
            team_data,
            r: 20,
            xValue
        })

};
