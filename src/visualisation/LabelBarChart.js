import * as d3 from 'd3';


/**
 * Represent data with a Bar Chart representing the number of documents for
 * each label. Has the added functionality of colouring the bar for the 
 * currently active document.
 */
export class LabelBarChart {
    /**
     * Create a new LabelChart with given attributes and data.
     * 
     * @param {String} DOMElementId - The element id to receive the SVG node 
     * @param {Number} width - The DOM element width
     * @param {Number} height - The DOM element height
     * @param {Object} data - The data needed to create the chart 
     * @constructor
     */
    constructor(DOMElementId, width, height, data) {
        this.DOMElementId = DOMElementId;
        this.width = width;
        this.height = height;
        this.data = this.formatData(data);
        this.selectedLabel = data.selectedLabel;
        this.color = "steelblue";
        this.selectedColor = d3.rgb(17, 189, 80);
        this.margin = ({top: 30, right: 0, bottom: 30, left: 40});
        this.createChart();
    }

    /**
     * Create the SVG element and append it to the DOM.
     */
    createChart() {
        // Scale data to x-axis
        let x = d3.scaleBand()
            .domain(d3.range(this.data.length))
            .range([this.margin.left, this.width - this.margin.right])
            .padding(0.1);

        // Scale data to y-axis
        let y = d3.scaleLinear()
            .domain([0, d3.max(this.data, d => d.count)]).nice()
            .range([this.height - this.margin.bottom, this.margin.top]);
        
        // Draw x-axis
        let xAxis = g => g 
            .attr("transform", `translate(0, 
                ${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(x)
                .tickFormat(i => this.data[i].label).tickSizeOuter(0));

        // Draw y-axis
        let yAxis = g => g
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, this.data.format))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", -this.margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("Documents (nbr)"));

        // Create svg element
        let svg = d3.create("svg")
            .attr("viewBox", [0, 0, this.width, this.height]);

        // Append bars to the svg element
        svg.append("g")
            .selectAll("rect")
            .data(this.data)
            .join("rect")
                .attr("fill", d => this.selectedLabel === d.label
                    ? this.selectedColor : this.color)
                .attr("x", (d, i) => x(i))
                .attr("y", d => y(d.count))
                .attr("height", d => y(0) - y(d.count))
                .attr("width", x.bandwidth());

        // Append x and y axis to the svg element
        svg.append("g")
            .call(xAxis);
        svg.append("g")
            .call(yAxis);

        // Ensure parent DOM element is empty before appending svg element
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
        this.selectedLabel = data.selectedLabel

        this.createChart();
    }

    /**
     * Format the data to fit the chart's required formatting.
     * 
     * @param {Object} data - The unformatted data
     */
    formatData(data) {
        let userLabels = Object.values(data.labelledDocs);
        let predictionsArray = Object.values(data.predictions);
        let predictedLabels = predictionsArray.map(prediction => 
            prediction.label);

        let allLabels = userLabels.concat(predictedLabels);
        let formattedData = [];
        for (let labelName in data.labels) {
            let count = 0;
            for (let label in allLabels) {
                if (allLabels[label] === data.labels[labelName]) {
                    count ++;
                }
            }
            formattedData.push({label: data.labels[labelName], count: count});
        }

        return formattedData;
    }
}