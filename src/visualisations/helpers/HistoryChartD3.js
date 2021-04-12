import * as d3 from 'd3';
  
export const draw = async (props, data, maxCount) => {
  const div_class = `.div_${props.id}`;
  const svg_id = `svg_${props.id}`;

  const margin = {top: 20, right: 20, bottom: 0, left: 40};
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${div_class} > *`).remove();

  const svg = d3.select(div_class)
    .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.right)
      .attr('id', svg_id)
  
  const weeks = ['1', '2', '3', '4', '5'].reverse()
  const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']

  const x = d3.scaleBand()
    .domain(days)
    .range([margin.left, width - margin.right])
  
  const y = d3.scaleBand()
    .domain(weeks)
    .range([height - margin.bottom, margin.top])
  
  const xAxis = g => g
    .attr("transform", `translate(-1, ${height - margin.bottom} )`)
    .call(d3.axisBottom(x).tickSizeOuter(0))

  const yAxis = g => g
    .attr("transform", `translate(${margin.left - 1}, 0)`)
    .call(d3.axisLeft(y).tickSizeOuter(0));

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  const color = d3.scaleLinear()
    .range(["white", "#69b3a2"])
    .domain([0, maxCount])

  svg.selectAll()
    .data(data, d => `${d.week}:${d.day}`)
    .enter()
    .append("rect")
    .attr("x", d => x(d.day))
    .attr("y", d => y(d.week))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", d => color(d.count))

  svg.append('text')
    .attr('x', width/2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('History');
}
