export const length = (
  selection,
  { data, height }
) => {
  const barHeight = (d) => d * 25 + 10;
  selection
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => d * 80 + 20)
    .attr('y', (d) => height / 2 - barHeight(d))
    .attr('width', 50)
    .attr('height', barHeight);
};
