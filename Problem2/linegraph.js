/**
 * Created by hen on 2/20/14.
 */
	var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width, sets;

	margin = {
		top: 10,
		right: 10,
		bottom: 30,
		left: 100
	};

	width = 1200 - margin.left - margin.right;

	height = 350 - margin.bottom - margin.top;

	bbVis = {
		x: 0 + 100,
		y: 10,
		w: width - 100,
		h: height
	};

	
	var color = d3.scale.category10();
	
	var dataSet = [];

	svg = d3.select("#vis").append("svg").attr({
			width: width + margin.left + margin.right,
			height: height + margin.top + margin.bottom
		}).append("g").attr({
			transform: "translate(" + margin.left + "," + margin.top + ")"
		});

	
		
	// Many bits and pieces here borrowed from http://bl.ocks.org/mbostock/3884955)
	
	d3.csv("timeline.csv", function(data) {
		
		dataSet = data;
			
		// Rebuild the data in a way that preserves the headers but keeps it manageable
		color.domain(d3.keys(dataSet[0]).filter(function(key) {
			return key !== "Year"; 
		}));
			
		sets = color.domain().map(function(name) {
			return {
				name: name,
				values: dataSet.map(function(d) {
					return {year: d.Year, pop: d[name], name: name};
				})
			};
		});
		
		return createVis();
	});

	
	createVis = function() {
		var xAxis, xScale, yAxis,  yScale;

		xScale = d3.scale.linear().domain(d3.extent(dataSet, function(d) { return parseInt(d.Year); })).range([0, bbVis.w]);  // define the right domain generically
		
		
		yScale = d3.scale.linear().domain([d3.max(sets, function(s) { 
			return d3.max(s.values, function(v) { 
				return parseInt(v.pop); 
			}); 
		}), 0]).range([0, bbVis.h]);  
		
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
			.tickFormat(d3.format("d"));
		var yAxis = d3.svg.axis().scale(yScale).orient("left");
		
		svg.append("g")
			.attr("id", "xaxis")
			.attr("transform", "translate(0," + (height) + ")")
			.call(xAxis);
			
		svg.append("g").attr("id", "yaxis").call(yAxis);
		
		
		// Make lines
		function cleanup(cleanarray)
		{
			for (i = 0; i < cleanarray.length; i++)
			{
				if (cleanarray[i].pop == "")
				{
					cleanarray.splice(i, 1);
					i--;
				}
			}
			return cleanarray;
		}
		
		var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return xScale(d.year); 
			})
			.y(function(d) { 
				return yScale(d.pop); 
			});
			
		var dot = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return xScale(d.year); 
			})
			.y(function(d) { 
				return yScale(d.pop); 
			});
		
		var set = svg.selectAll(".set")
			.data(sets)
			.enter()
			.append("g")
			.attr("class", "set");
		
		set.append("path")
			.attr("class", "line")
			.attr("d", function(d) {
				return line(cleanup(d.values)); 
			})
			.style("stroke", function(d) { return color(d.name); })
			.attr("fill", "none");
		
			
		var point = set.append("g")
			.attr("class", "dots");
		
		point.selectAll('circle')
			.data(function(d) { 
				return d.values
			})
			.enter()
			.append('circle')
			.attr("cx", function(d) {
				return xScale(d.year);
			})
			.attr("cy", function(d) {
				return yScale(d.pop) })
			.attr("fill", function(d){
				return color(d.name);
			})
			.attr("r", 2);
	};
