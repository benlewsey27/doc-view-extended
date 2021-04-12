import * as d3 from 'd3';

export const draw = async (props, data) => {
  const div_class = `.div_${props.id}`;
  const svg_id = `svg_${props.id}`;

  const margin = {top: 0, right: 0, bottom: 0, left: 0};
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${div_class} > *`).remove();

  const svg = d3.select(div_class)
    .append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('id', svg_id)
    .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(width / 6);

  const pieGenerator = d3.pie()
    .value(d => d.count)
    .sort(null)

  const colors = ['steelblue', 'lightgrey']

  svg.selectAll('path')
    .data(pieGenerator(data))
    .enter()
      .append('path')
        .attr('fill', (d, i) => colors[i])
        .attr('d', arcGenerator)

  svg.append('text')
    .attr('x', 0)
    .attr('y', -height/3)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Number Of Labelled vs. Unlabelled Documents');

  svg.append('text')
    .attr('x', 0)
    .attr('y', height/2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('font-weight', 'bold')
    .text(`${data.reduce((n, data) => n + data.count, 0)} Documents`);
}
