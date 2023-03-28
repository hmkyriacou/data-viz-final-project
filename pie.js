import { select, arc, scaleOrdinal, schemeSpectral } from "d3";

export const pieimg = (container,
    {
        team_data,
        r,
        xValue
    }) => {

    for (const team of team_data) {
        team.chartFunc = arc()
            .innerRadius(0)
            .outerRadius(r)
            .startAngle(0)
            .endAngle(xValue(team) * (-360 * (Math.PI / 180)))
    }

    console.log(team_data)

    const color = scaleOrdinal()
        .domain(team_data.map((e) => {
            return e.city
        }))
        .range(schemeSpectral[11])

    container
        .selectAll('svg.pie')
        .data(team_data)
        .join('svg')
        .attr('class', 'pie')
        .each(function (d, i) {
            select(this)
                .append('path')
                .attr('d', d.chartFunc)
                .style('fill', color(d.city))
                .attr(
                    'transform', `translate(${d.x}, ${d.y})`
                );
        })

    // Trying to clip an image
    // container
    //     .selectAll('svg.pie')
    //     .data(team_data)
    //     .join('svg')
    //     .attr('class', 'pie')
    //     .each(function (d, i) {
    //         const clipPath = select(this)
    //             .append('clipPath')
    //             .attr('id', `pie-clip-${i}`)
    //         clipPath
    //             .append('path')
    //             .attr('d', d.chartFunc)
    //             .style('fill', 'black')
    //             .attr(
    //                 'transform', `translate(${d.x}, ${d.y})`
    //             );
    //         clipPath.append('circle').attr('cx', r).attr('cy', r).attr('r', r)

    //         select(this)
    //             .selectAll('image')
    //             .data([null])
    //             .join('image')
    //             //.attr('x', d.x)
    //             //.attr('y', d.y)
    //             .attr('width', r * 2)
    //             .attr('height', r * 2)
    //             .attr('xlink:href', d.img)
    //         //.attr('clip-path', `url(#pie-clip-${i})`)

    //         //.attr("style", `transform: translate(-${r}px, -${r}px);`);
    //         select(this)
    //             .attr('width', r * 2)
    //             .attr('height', r * 2)
    //             .attr(
    //                 'transform', `translate(${d.x - r}, ${d.y - r})`
    //             )
    //     })



    // .attr('x', (d) => d.y)
    // .attr('y', (d) => d.x)
    // .attr('width', r)
    // .attr('height', r)
    // .attr('xling:href', (d) => d.img)
    // .attr("style", "transform: translate(-40px, -40px);");


}