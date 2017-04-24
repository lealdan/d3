/*
Danny Leal, 04/20/17
scatterplotMatrix.js,
This script creates a scatterplot matrix of data describing the
Challenger incident of 1986.

This code was written by adopting Eric Alexander's "d3_lab" code.
*/

//Sizing variables
w = 310
h = 164;
xOffset = 20;
yOffset = 30;
margin = 10;
//key values from the dataset
vals = ['flight_index', 'num_o_ring_distress', 'launch_temp', 'leak_check_pressure', 'tufte_metric'];

// Initialize a scatterplot for each span element
initScatterplot('#pointsSVG1', vals[1], vals[2]);
initScatterplot('#pointsSVG2', vals[1], vals[3]);
initScatterplot('#pointsSVG3', vals[1], vals[4]);
initScatterplot('#pointsSVG4', vals[2], vals[1]);
initScatterplot('#pointsSVG5', vals[2], vals[3]);
initScatterplot('#pointsSVG6', vals[2], vals[4]);
initScatterplot('#pointsSVG7', vals[3], vals[1]);
initScatterplot('#pointsSVG8', vals[3], vals[2]);
initScatterplot('#pointsSVG9', vals[3], vals[4]);
initScatterplot('#pointsSVG10', vals[4], vals[1]);
initScatterplot('#pointsSVG11', vals[4], vals[2]);
initScatterplot('#pointsSVG12', vals[4], vals[3]);

function initScatterplot(svgElement, xVal, yVal) {
	//Import data
	d3.csv('challenger.csv', function(csvData) {
		// Define scales for converting values to screen coordinates
		xScale = d3.scale.linear()
					.domain([d3.min(csvData, function(d) { return parseFloat(d[xVal]); })-1,
							 d3.max(csvData, function(d) { return parseFloat(d[xVal]); })+1])
					.range([yOffset + margin, w - margin]);
		yScale = d3.scale.linear()
					.domain([d3.min(csvData, function(d) { return parseFloat(d[yVal]); })-1,
							 d3.max(csvData, function(d) { return parseFloat(d[yVal]); })+1])
					.range([h - xOffset - margin, margin]); // Notice this is backwards!

		// Create svgs to contain scatterplots
		svg = d3.select(svgElement).append('svg:svg')
					.attr('width', w)
					.attr('height', h);

		// Build axes
		xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('bottom')
					.ticks(5);
		xAxisG = svg.append('g')
					.attr('class', 'axis')
					.attr('transform', 'translate(0,' + (h - xOffset) + ')')
					.call(xAxis);
		yAxis = d3.svg.axis()
					.scale(yScale)
					.orient('left')
					.ticks(5);
		yAxisG = svg.append('g')
					.attr('class', 'axis')
					.attr('transform', 'translate(' + yOffset + ',0)')
					.call(yAxis);

		// Setup tooltip
		var tooltip = d3.select("body").append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);

		// Bind data to circles
		var circle = svg.selectAll('circle')
        	.data(csvData);

		// Create circles
		circle.enter()
			.append('svg:circle');

		// Update circles so that each is associated with a different data item
		circle.attr('class', function(d) { return 'flight_' + d['flight_index']; })
			// x-coordinate
			.attr('cx', function(d) { return xScale(d[xVal]); })
			// y-coordinate
			.attr('cy', function(d) { return yScale(d[yVal]); })
			// radius
			.attr('r', 4.0)
            // color
			.style('fill', 'steelblue')
			// Setup interactive functions
			.on("mouseover", function(d) {
				if (d3.select(this).attr('r') != 6.0) {
					d3.select(this).attr('r', 5.5).style("fill", "red");
				}
	            tooltip.transition()
	                .duration(200)
	                .style("opacity", .9);
				tooltip.text(xVal + ": " + d[xVal] + "\n" + yVal + ": " + d[yVal])
					.style("top", (d3.event.pageY + 16) + "px")
					.style("left", (d3.event.pageX + 16) + "px");
	            })
	        .on("mouseout", function(d) {
				if (d3.select(this).attr('r') != 6.0) {
					d3.select(this).attr('r', 4.0).style("fill", "steelblue");
		            tooltip.transition()
		                .duration(500)
		                .style("opacity", 0);
				}
	        })
			.on("click", function(d) {
				if (d3.select(this).attr('r') == 4.0 || d3.select(this).attr('r') == 5.5) {
					d3.selectAll('.flight_' + d['flight_index']).attr('r', 6.0).style("fill", "orange");
				} else {
					d3.selectAll('.flight_' + d['flight_index']).attr('r', 4.0).style("fill", "steelblue");
				}
			});
	});
};
