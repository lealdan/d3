// Part of a brief D3 tutorial.
// Upon completion, will display an interactive scatterplot showing relationship between
//   different values associated with the top 100 words in Shakespeare's First Folio
// CS 314, Spring 2017
// Eric Alexander

// First, we will create some constants to define non-data-related parts of the visualization
w = 300;			// Width of our visualization
h = 170;			// Height of our visualization
xOffset = 40;		// Space for x-axis labels
yOffset = 150;		// Space for y-axis labels
margin = 10;		// Margin around visualization
vals = ['flight_index', 'num_o_ring_distress', 'launch_temp', 'leak_check_pressure', 'tufte_metric'];

// Next, we will load in our CSV of data
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
	d3.csv('challenger.csv', function(csvData) {
		// This will define scales that convert values
		// from our data domain into screen coordinates.
		xScale = d3.scale.linear()
					.domain([d3.min(csvData, function(d) { return parseFloat(d[xVal]); })-1,
							 d3.max(csvData, function(d) { return parseFloat(d[xVal]); })+1])
					.range([yOffset + margin, w - margin]);
		yScale = d3.scale.linear()
					.domain([d3.min(csvData, function(d) { return parseFloat(d[yVal]); })-1,
							 d3.max(csvData, function(d) { return parseFloat(d[yVal]); })+1])
					.range([h - xOffset - margin, margin]); // Notice this is backwards!

		// Next, we will create an SVG element to contain our visualization.
		svg = d3.select(svgElement).append('svg:svg')
					.attr('width', w)
					.attr('height', h);

		// Build axes! (These are kind of annoying, actually...)
		xAxis = d3.svg.axis()
					.scale(xScale)
					.orient('bottom')
					.ticks(5);
		xAxisG = svg.append('g')
					.attr('class', 'axis')
					.attr('transform', 'translate(0,' + (h - xOffset) + ')')
					.call(xAxis);
		xLabel = svg.append('text')
					.attr('class','label')
					.attr('x', w/2)
					.attr('y', h - 5)
					.text(xVal);

		yAxis = d3.svg.axis()
					.scale(yScale)
					.orient('left')
					.ticks(5);
		yAxisG = svg.append('g')
					.attr('class', 'axis')
					.attr('transform', 'translate(' + yOffset + ',0)')
					.call(yAxis);
		yLabel = svg.append('text')
					.attr('class','label')
					.attr('x', yOffset/2)
					.attr('y', h/2-10)
					.text(yVal);


		// Now, we will start actually building our scatterplot!
		// *****************************************************
		// ************** YOUR CODE WILL GO HERE! **************
		// *****************************************************

		var tooltip = d3.select("body").append("div")
		    .attr("class", "tooltip")
		    .style("opacity", 0);
			// Select elements

		// Bind data to elements
		var circle = svg.selectAll('circle')
        	.data(csvData);

		// Create new elements if needed
		circle.enter()
			.append('svg:circle');

		// Update our selection
		// Give it a class
		circle.attr('class', 'circle')
			// x-coordinate
			.attr('cx', function(d) { return xScale(d[xVal]); })
			// y-coordinate
			.attr('cy', function(d) { return yScale(d[yVal]); })
			// radius
			.attr('r', 3.5)
            // color
			.style('fill', 'steelblue')
			// tooltip
			.on("mouseover", function(d) {
				if (d3.select(this).attr('r') != 4.7) {
					d3.select(this).attr('r', 4.5).style("fill", "orange");
		            tooltip.transition()
		                .duration(200)
		                .style("opacity", .9);
					tooltip.text("X: " + d[xVal] + "\n" + "Y: " + d[yVal])
						.style("top", (d3.event.pageY + 16) + "px")
						.style("left", (d3.event.pageX + 16) + "px");
				}
	            })
	        .on("mouseout", function(d) {
				if (d3.select(this).attr('r') != 4.7) {
					d3.select(this).attr('r', 3.5).style("fill", "steelblue");
		            tooltip.transition()
		                .duration(500)
		                .style("opacity", 0);
				}
	        })
			.on("click", function(d) {
				if (d3.select(this).attr('r') == 3.5 || d3.select(this).attr('r') == 4.5) {
					d3.select(this).attr('r', 4.7).style("fill", "orange");
				} else {
					d3.select(this).attr('r', 3.5).style("fill", "steelblue");
				}
			});
	});
};
