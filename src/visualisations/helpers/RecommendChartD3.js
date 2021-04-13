import * as d3 from 'd3';

function wordWrapper(selection) {
  // eslint-disable-next-line func-names
  selection.each(function () {
    const node = d3.select(this);

    let lineNumber = 0;
    let line = [];
    let word;

    const x = node.attr('x');
    const y = node.attr('y');
    const rectWidth = node.attr('data-width');
    const words = node.text().split('').reverse();

    function addTspan(text) {
      lineNumber += 1;
      return node
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', `${lineNumber * 12}px`)
        .text(text);
    }

    let tspan = node.text('').append('tspan').attr('x', x).attr('y', y);

    while (words.length >= 1) {
      word = words.pop();
      line.push(word);
      tspan.text(line.join(''));
      const tspanLength = tspan.node().getComputedTextLength();

      if (tspanLength > rectWidth - 20) {
        line.pop();
        tspan.text(line.join(''));
        line = [word];
        tspan = addTspan(word);
      }
    }

    addTspan(`(${Math.floor(node.attr('probability') * 100)}%)`);
  });
}

export const draw = async (props, data) => {
  const divClass = `.div_${props.id}`;
  const svgId = `svg_${props.id}`;

  const margin = { top: 20, right: 0, bottom: 0, left: 0 };
  const width = Number(props.width);
  const height = Number(props.height);

  d3.select(`${divClass} > *`).remove();

  const svg = d3
    .select(divClass)
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right + margin.left)
    .attr('id', svgId);

  const x = d3
    .scaleBand()
    .domain([1, 2, 3])
    .range([margin.left, width - margin.right])
    .padding([0.4]);

  svg
    .selectAll('rect')
    .data(data, (d) => `${d.id}`)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.id))
    .attr('y', height / 3)
    .style('fill', 'white')
    .attr('stroke', 'black')
    .attr('height', x.bandwidth() * 1.3)
    .attr('width', x.bandwidth() * 1.3);

  svg
    .selectAll('text')
    .data(data, (d) => `${d.id}`)
    .enter()
    .append('text')
    .attr('x', (d) => x(d.id) + 10)
    .attr('y', height / 3 + 20)
    .attr('font-size', '12px')
    .attr('data-width', x.bandwidth() * 1.3)
    .attr('probability', (d) => d.probability)
    .text((d) => `${d.filename}`)
    .call(wordWrapper);

  svg
    .append('text')
    .attr('x', width / 2)
    .attr('y', 30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .text('Top Three Strongest and Unlabelled Documents');
};
