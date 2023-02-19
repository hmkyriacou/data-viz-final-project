import { schemeCategory10 } from 'd3';

export const hue = (
  selection,
  { data, height }
) => {
  selection
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => d * 70 + 60)
    .attr('cy', height / 2)
    .attr('r', 30)
    .attr('fill', (d, i) => schemeCategory10[i]);
};
