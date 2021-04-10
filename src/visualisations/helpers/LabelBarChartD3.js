import * as d3 from 'd3';

export const draw = async (props, data) => {
  const div_class = `.div_${props.id}`;
  const svg_id = `svg_${props.id}`;

  const margin = {top: 30, right: 0, bottom: 0, left: 40};
  const width = Number(props.width);
  const height = Number(props.height);

  const selectedLabel = data.selectedLabel;
  const selectedColor = d3.rgb(17, 189, 80);
  const color = "steelblue";

  d3.select(`${div_class} > *`).remove();

  const svg = d3.select(div_class)
    .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.right * 1.35)
      .attr('id', svg_id)
  
  const x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);
  
  const xAxis = g => g
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x)
      .tickFormat(i => data[i].label).tickSizeOuter(0));
  
  const yAxis = g => g
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(null, data.format))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
      .attr("x", -margin.left)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("Documents (nbr)"));

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("fill", d => selectedLabel === d.label ? selectedColor : color)
      .attr("x", (d, i) => x(i))
      .attr("y", d => y(d.count))
      .attr("height", d => y(0) - y(d.count))
      .attr("width", x.bandwidth());
}
