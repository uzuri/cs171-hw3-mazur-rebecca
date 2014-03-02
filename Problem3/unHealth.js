	var bbDetail, bbOverview, dataSet, svg;
	
	var margin = {
		top: 50,
		right: 50,
		bottom: 50,
		left: 60
	};
	
	var width = 1250 - margin.left - margin.right;
	
	var height = 500 - margin.bottom - margin.top;
	
	bbOverview = {
		x: 0,
		y: 10,
		w: width,
		h: 50
	};
	
	bbDetail = {
		x: 0,
		y: 100,
		w: width,
		h: 300
	};
	
	var color = d3.scale.category10();
	
	dataSet = [];
	
	var parseDate = d3.time.format("%B %Y").parse;
	
	svg = d3.select("#visUN").append("svg").attr({
			width: width + margin.left + margin.right,
			height: height + margin.top + margin.bottom
		}).append("g").attr({
			transform: "translate(" + margin.left + "," + margin.top + ")"
		});
	
	
	d3.csv("unHealth.csv", function(data) {
		
		dataSet = data;
		
		
		dataSet.forEach(function(d){
			d.date  = parseDate(d.date);
			d.healthcontent  = parseInt(d.healthcontent);
		});
			
			
		color.domain(d3.keys(dataSet[0]).filter(function(key) {
			return key !== "Year"; 
		}));
			
		sets = color.domain().map(function(name) {
			return {
				name: name,
				values: dataSet.map(function(d) {
					return {date: d.date, healthcontent: d.healthcontent, name: name};
				})
			};
		});
		
		createVis();
	});

	
	createVis = function() {
		
		//Overview
		var xAxis, xScale, yAxis,  yScale;

			
		xScale = d3.time.scale().range([0, width - margin.left - margin.right]).domain([d3.min(dataSet, function(d) { 
			return d.date; 
		}), d3.max(dataSet, function(d) { 
			return d.date; 
		})]);
		yScale = d3.scale.linear().domain([d3.max(dataSet, function(d) { 
			return d.healthcontent; 
		}), 0]).range([0, bbOverview.h]); 
		
		
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");	
		var yAxis = d3.svg.axis().scale(yScale).ticks(2).orient("left");
		
		svg.append("g")
			.attr("id", "yaxis")
			.attr("transform", "translate(0," + (bbDetail.h) + ")")
			.call(yAxis);
		svg.append("g")
			.attr("id", "xaxis")
			.attr("transform", "translate(0," + (bbOverview.h + bbDetail.h) + ")")
			.call(xAxis);
		
		
		// Make lines
		var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return xScale(d.date); 
			})
			.y(function(d) { 
				return yScale(d.healthcontent); 
			});
			
		var dot = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return xScale(d.date); 
			})
			.y(function(d) { 
				return yScale(d.healthcontent); 
			});
		
		var set = svg.selectAll(".set")
			.data(sets)
			.enter()
			.append("g")
			.attr("class", "set");
		
		set.append("path")
			.attr("class", "line")
			.attr("class", "path")
			.attr("d", function(d) {
				return line(d.values); 
			})
			.attr("transform", "translate(0," + (bbDetail.h) + ")");
		
			
		var point = set.append("g")
			.attr("class", "dots");
		
		point.selectAll('circle')
			.data(function(d) { 
				return d.values
			})
			.enter()
			.append('circle')
			.attr("class", "nodes")
			.attr("cx", function(d) {
				return xScale(d.date);
			})
			.attr("cy", function(d) {
				return yScale(d.healthcontent) })
			.attr("r", 2)
			.attr("transform", "translate(0," + (bbDetail.h) + ")");
			
			
		brush = d3.svg.brush().x(xScale).on("brush", brushed);
		
		svg.append("g")
			.attr("class", "brush")
			.call(brush)
			.selectAll("rect").attr({
					height: bbOverview.h,
					transform: "translate(0," + (bbDetail.h)	 + ")"
			});
		
		function brushed()
		{
		}
	
		// Detail view
		
		var dxAxis, dxScale, dyAxis,  dyScale;

			
		dxScale = d3.time.scale().range([0, width - margin.left - margin.right]).domain([d3.min(dataSet, function(d) { 
			return d.date; 
		}), d3.max(dataSet, function(d) { 
			return d.date; 
		})]);
		dyScale = d3.scale.linear().domain([d3.max(dataSet, function(d) { 
			return d.healthcontent; 
		}), 0]).range([0, bbDetail.h - margin.bottom]); 
		
		
		var dxAxis = d3.svg.axis().scale(dxScale).orient("bottom");	
		var dyAxis = d3.svg.axis().scale(dyScale).orient("left");
		
		svg.append("g")
			.attr("id", "dyaxis")
			.call(dyAxis);
		svg.append("g")
			.attr("id", "dxaxis")
			.attr("transform", "translate(0," + (bbDetail.h - margin.bottom) + ")")
			.call(dxAxis);
		
		
		// Make lines
		var line = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return dxScale(d.date); 
			})
			.y(function(d) { 
				return dyScale(d.healthcontent); 
			});
			
		var dot = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { 
				return dxScale(d.date); 
			})
			.y(function(d) { 
				return dyScale(d.healthcontent); 
			});
		
		var set = svg.selectAll(".dset")
			.data(sets)
			.enter()
			.append("g")
			.attr("class", "dset");
		
		set.append("path")
			.attr("class", "detailPath")
			.attr("class", "path")
			.attr("d", function(d) {
				return line(d.values); 
			});
		
		var area = d3.svg.area()
			.x(function(d) { return dxScale(d.date); })
			.y0(bbDetail.h - margin.bottom)
			.y1(function(d) { return dyScale(d.healthcontent); });	
			
		set.append("path")
			.attr("class", "detailArea")
			.attr("d", function(d) {
				return area(d.values); 
			});
			
			
			
		var point = set.append("g")
			.attr("class", "ddots");
		
		point.selectAll('circle')
			.data(function(d) { 
				return d.values
			})
			.enter()
			.append('circle')
			.attr("class", "nodes")
			.attr("cx", function(d) {
				return dxScale(d.date);
			})
			.attr("cy", function(d) {
				return dyScale(d.healthcontent) })
			.attr("r", 2);
	};
