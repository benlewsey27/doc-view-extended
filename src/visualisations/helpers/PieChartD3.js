import * as d3 from 'd3';

export const draw = async (props, data) => {
  const divClass = `.div_${props.id}`;
  const svgId = `svg_${props.id}`;

  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${divClass} > *`).remove();

  const svg = d3
    .select(divClass)
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .attr('id', svgId)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const arcGenerator = d3
    .arc()
    .innerRadius(0)
    .outerRadius(width / 6);

  const pieGenerator = d3
    .pie()
    .value((d) => d.count)
    .sort(null);

  const colors = ['steelblue', 'lightgrey'];

  svg
    .selectAll('path')
    .data(pieGenerator(data))
    .enter()
    .append('path')
    .attr('fill', (d, i) => colors[i])
    .attr('d', arcGenerator);

  svg
    .append('text')
    .attr('x', 0)
    .attr('y', -height / 3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Number Of Labelled vs. Unlabelled Documents');

  svg
    .append('text')
    .attr('x', 0)
    .attr('y', height / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('font-weight', 'bold')
    .text(`${data.reduce((n, d) => n + d.count, 0)} Documents`);
};
