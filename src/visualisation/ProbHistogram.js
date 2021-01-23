import * as d3 from 'd3';


/**
 * Represent data with a Histogram representing the probability distribution
 * for prediction uncertainty.
 */
export class ProbHistogram {
    /**
     * Create a new ProbHistogram with given attributes and data
     * 
     * @param {String} DOMElementId - The element id to receive the SVG node
     * @param {Number} width - The DOM element width
     * @param {Number} height - The DOM element height
     * @param {Object} data - The data needed to create the chart
     */
    constructor(DOMElementId, width, height, data) {
        this.DOMElementId = DOMElementId;
        this.width = width;
        this.height = height;
        this.data = this.formatData(data);
        this.color = "steelblue";
        this.margin = ({top: 20, right: 20, bottom: 30, left: 40});
        this.createChart();
    }

    /**
     * Create the SVG element and append it to the DOM
     */
    createChart() {
        // Scale data to x-axis
        let x = d3.scaleLinear()
            .domain(d3.extent(this.data)).nice()
            .range([this.margin.left, this.width - this.margin.right]);

        // Define histogram bins
        let bins = d3.histogram()
            .domain(x.domain())
            .thresholds(x.ticks(40))(this.data)

        // Scale data to y-axis
        let y = d3.scaleLinear()
            .domain([0, d3.max(bins, d => d.length)]).nice()
            .range([this.height - this.margin.bottom, this.margin.top]);

        // Draw x-axis
        let xAxis = g => g
            .attr("transform", `translate(0, 
                ${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(x).ticks(this.width / 80).tickSizeOuter(0))
            .call(g => g.append("text")
                .attr("x", this.width - this.margin.right)
                .attr("y", -4)
                .attr("fill", "currentColor")
                .attr("font-weight", "bold")
                .attr("text-anchor", "end")
                .text("Label certainty(%)"));

        // Draw y-axis
        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left}, 0)`)
            .call(d3.axisLeft(y).ticks(this.height / 80))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 4)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text("Documents (nbr)"));

        // Create svg element
        let svg = d3.create("svg")
            .attr("viewBox", [0, 0, this.width, this.height]);

        // Append bins to the svg element
        svg.append("g")
            .attr("fill", this.color)
            .selectAll("rect")
            .data(bins)
            .join("rect")
                .attr("x", d => x(d.x0) + 1)
                .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
                .attr("y", d => y(d.length))
                .attr("height", d => y(0) - y(d.length));

        // Append x and y axis to the svg element
        svg.append("g").call(xAxis);
        svg.append("g").call(yAxis);

        // Ensure DOM element is empty before appending new graph
        let element = document.getElementById(this.DOMElementId);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        document.getElementById(this.DOMElementId).append(svg.node());
    }

    /**
     * Update chart attributes and redraw chart.
     * 
     * @param {Number} width - The DOM element width
     * @param {Number} height - The DOM element height 
     * @param {Object} data - The data needed to create the chart 
     */
    updateChart(width, height, data) {
        this.width = width;
        this.height = height;
        this.data = this.formatData(data);

        this.createChart();
    }

    /**
     * Format the data to fit the chart's required formatting.
     * 
     * @param {Object} data - The unformatted data
     */
    formatData(data) {
        let probabilities = [];

        for (let prediction in data.predictions) {
            let probability = data.predictions[prediction].probability;
            probabilities.push(probability);
        }

        return probabilities;
    }
}