import * as d3 from 'd3';

export const draw = async (props, data) => {
  const div_class = `.div_${props.id}`;
  const svg_id = `svg_${props.id}`;

  const margin = {top: 20, right: 10, bottom: 0, left: 40};
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${div_class} > *`).remove();

  const svg = d3.select(div_class)
    .append('svg')
      .attr('height', height + margin.top + margin.bottom)
      .attr('width', width + margin.right * 1.35)
      .attr('id', svg_id)
  
  const x = d3.scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right])
  
  const bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(40))(data)

  const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)]).nice()
      .range([height - margin.bottom, margin.top]);
  
  const xAxis = g => g
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
    .call(g => g.append("text")
      .attr("x", width - margin.right)
      .attr("y", -4)
      .attr("fill", "currentColor")
      .attr("font-weight", "bold")
      .attr("text-anchor", "end")
      .text("Label certainty(%)"));
  
  const yAxis = g => g
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(height / 80))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 4)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text("Documents (nbr)"));

  svg.append("g").call(xAxis);
  svg.append("g").call(yAxis);

  svg.append("g")
    .attr("fill", "steelblue")
    .selectAll("rect")
    .data(bins)
    .join("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("y", d => y(d.length))
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("height", d => y(0) - y(d.length));
}
