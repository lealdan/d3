/*
Danny Leal, 04/20/17
parallelCoordinates.js,
This script creates a parallel coordinates plot of data describing the
Challenger incident of 1986.

This code was written by following an example by Mike Bostock.
The code can be found at: https://bl.ocks.org/mbostock/1341021
*/

//Setup dimensions of the chart
var width = 1220,
    height = 580;
    offset = 40;

//Setup scaling variables
var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {};

//Setup axes and paths for data lines
var axis = d3.svg.axis().orient("left"),
    data_lines;

//Create the svg element
var svg = d3.select("body").append("svg")
    .attr("width", width + offset)
    .attr("height", height + offset)
  .append("g")
    .attr("transform", "translate(" + 10 + "," + 30 + ")");

//Import data from the csv
d3.csv("challenger.csv", function(csvData) {

    // Extract keys (dimensions) and create a scale for each
    x.domain(keys = d3.keys(csvData[0]).filter(function(d) {
        return d != "flight_index" && (y[d] = d3.scale.linear()
            .domain(d3.extent(csvData, function(p) { return +p[d]; }))
            .range([height, 0]));
    }));

    // Add data lines
    data_lines = svg.append("g")
        .attr("class", "data_lines")
    .selectAll("path")
        .data(csvData)
    .enter().append("path")
        .attr("d", line_path)

        //Introduce line interactions
        .on("mouseover", function(d) {
            d3.select(this)
                .style("stroke", this.stroke = (this.stroke == "red" ? "red" : "steelblue"))
                .style("stroke-width", 7);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .style("stroke", this.stroke = (this.stroke == "red" ? "red" : "orange"))
                .style("stroke-width", 3);
        })
        .on("click", function(d) {
            d3.select(this)
                .style("stroke", this.stroke = (this.stroke == "red" ? "steelblue" : "red"))
                .style("stroke-width", 7);
        });

    // Add a group element for each key to contain an axis and a title
    var g = svg.selectAll(".key")
        .data(keys)
    .enter().append("g")
        .attr("class", "key")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Create the axis and title for each key.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });
});

// Returns the line for a given data point.
function line_path(d) {
    return d3.svg.line()(keys.map(function(p) { return [x(p), y[p](d[p])]; }));
}
