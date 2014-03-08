/**
 * Created by hen on 2/20/14.
 */
	var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width, sets;

	margin = {
		top: 10,
		right: 10,
		bottom: 30,
		left: 130
	};

	width = 1200 - margin.left - margin.right;

	height = 550 - margin.bottom - margin.top;

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
	
	d3.csv("timelinewithav.csv", function(data) {
		
		dataSet = data;
		
			
		// Rebuild the data in a way that preserves the headers but keeps it manageable
		color.domain(d3.keys(dataSet[0]).filter(function(key) {
			return key !== "Year"; 
		}));
		
		// hard set the color for the Average; yeah, there's better ways to do this, too, this isn't flexible.
		color.range()[5] = "black";
			
		sets = color.domain().map(function(name) {
			return {
				name: name,
				values: dataSet.map(function(d, i) {
					
					var diff = d[name] - d.Average;
					var diffper = Math.floor((diff/d.Average) * 100);
					
					if (d[name] != "")
					{
						return {year: d.Year, pop: d[name], name: name, fromset: "original", diff: diff, diffper: diffper, con: d.Average};
					}
					
					
					var prevval = i;
					var nextval = i;
					while (prevval > 0 && dataSet[prevval][name] == "")
					{
						prevval--;
					}
					while (nextval < dataSet.length - 1 && dataSet[nextval][name] == "")
					{
						nextval++;
					}
					
					if (dataSet[prevval][name] == "" || dataSet[nextval][name] == "")
					{
						return {year: d.Year, pop: d[name], name: name, fromset: "original", diff: "", diffper: "", con: d.Average};
					}
					
					var newval = +dataSet[prevval][name] + Math.floor(((dataSet[nextval][name] - dataSet[prevval][name]) * ((d.Year - dataSet[prevval].Year)/(dataSet[nextval].Year - dataSet[prevval].Year))));
					
					
					
					
					diff = newval - d.Average;
					diffper = Math.floor((diff/d.Average) * 100);
					
					
					
					return {year: d.Year, pop: newval, name: name, fromset: "faked", diff: diff, diffper: diffper, con: d.Average};
				})
			};
		});
		
		return createVis();
	});

	
	createVis = function() {
		
		
		var xAxis, xScale, yAxis,  yScale;
		var diffScale, diffperScale;

		xScale = d3.scale.linear().domain(d3.extent(dataSet, function(d) { return parseInt(d.Year); })).range([0, bbVis.w]);  // define the right domain generically
		
		
		yScale = d3.scale.linear().domain([d3.max(sets, function(s) { 
			return d3.max(s.values, function(v) { 
				return parseInt(v.pop); 
			}); 
		}), 0]).range([0, bbVis.h]);  
		
		
		
		diffScale = d3.scale.linear().domain([d3.max(sets, function(s) { 
			return d3.max(s.values, function(v) { 
				return parseInt(v.diff); 
			}); 
		}), d3.min(sets, function(s) { 
			return d3.min(s.values, function(v) { 
				return parseInt(v.diff); 
			}); 
		})]).range([0, bbVis.h]); 
		
		diffperScale = d3.scale.linear().domain([d3.max(sets, function(s) { 
			return d3.max(s.values, function(v) { 
				return parseInt(v.diffper); 
			}); 
		}), d3.min(sets, function(s) { 
			return d3.min(s.values, function(v) { 
				return parseInt(v.diffper); 
			}); 
		})]).range([0, bbVis.h]);  
		
		
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
			
			
		var diffline = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return xScale(d.year); 
			})
			.y(function(d) { 
				return diffScale(d.diff); 
			});
			
			
		var diffperline = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return xScale(d.year); 
			})
			.y(function(d) { 
				return diffperScale(d.diffper); 
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
				if (d.fromset != "original")
				{
					return "#cccccc";
				}
				return color(d.name);
			})
			.attr("r", 3);
			
		
		
		d3.select("input[value=\"data\"]").on("click", function(){
			yAxis = d3.svg.axis().scale(yScale).orient("left");
			svg.selectAll("#yaxis").transition().call(yAxis);
			svg.selectAll(".line").transition().attr("d", function(d) {
				return line(d.values); 
			});
			
			svg.selectAll("circle").transition()
				.attr("cy", function(d) {
					return yScale(d.pop) 
				});
		});
		
		d3.select("input[value=\"absolute\"]").on("click", function(){
			yAxis = d3.svg.axis().scale(diffScale).orient("left");
			svg.selectAll("#yaxis").transition().call(yAxis);
			svg.selectAll(".line").transition().attr("d", function(d) {
				return diffline(d.values); 
			});
			
			svg.selectAll("circle").transition()
				.attr("cy", function(d) {
					return diffScale(d.diff) 
				});
		});
		
		d3.select("input[value=\"relative\"]").on("click", function(){
			yAxis = d3.svg.axis().scale(diffperScale).orient("left").tickFormat(function(d) { return d + "%"});
			svg.selectAll("#yaxis").transition().call(yAxis);
			svg.selectAll(".line").transition().attr("d", function(d) {
				return diffperline(d.values); 
			});
			
			svg.selectAll("circle").transition()	
				.attr("cy", function(d) {
					return diffperScale(d.diffper) 
				});
		});
		
		d3.selectAll("circle").on("mouseover", function(d){
				
			d3.selectAll("#hovernode")
				.remove();
				
			
			svg.append("foreignObject")
				.attr("id", "hovernode")
				.attr("x", this.cx.baseVal.value)
				.attr("y", this.cy.baseVal.value)
				.attr("width", 200)
				.attr("height", 500)
				.html("<p style=\"background-color: white; padding: 5px; border: 1px solid black;\">" + d.year + " consensus: " + d.con + "<br />Current value: " + d.pop + "</p>");
			})
			.on("mouseout", function(d){
			
					d3.selectAll("#hovernode")
						.transition(60000)
						.remove();	
					
			});
	};
