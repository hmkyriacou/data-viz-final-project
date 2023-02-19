import { axisLeft, axisBottom } from 'd3'

export function axes(
    selection,
    { xScale, xLabel, yScale, yLabel, title}
) {
    selection
        .selectAll('g.x-axis')
        .data([null])
        .join('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${yScale.range()[0]})`)
        .call(axisBottom(xScale))


    selection
        .selectAll('g.y-axis')
        .data([null])
        .join('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${xScale.range()[0]},0)`)
        .call(axisLeft(yScale))

    selection
        .selectAll('text.x-axis')
        .data([null])
        .join('text')
        .attr("x", xScale.range()[0] + xScale.range()[1] / 2)
        .attr("y", yScale.range()[0] + 50)
        .attr("text-anchor", "middle")
        .text(xLabel)
        .attr('class', 'x-axis')

    selection
        .selectAll('text.y-axis')
        .data([null])
        .join('text')
        .attr("x", -(yScale.range()[0] + yScale.range()[1]) / 2)
        .attr("y", xScale.range()[0] - 50)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(yLabel)
        .attr('class', 'y-axis')

    selection
        .selectAll('text.title')
        .data([null])
        .join('text')
        .attr("x", xScale.range()[0] + xScale.range()[1] / 2)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .text(title)
        .attr("font-size", "2em")
        .attr('class', 'title')
}

