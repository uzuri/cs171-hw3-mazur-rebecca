var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 100
};

var width = 1200 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;

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
	
	sets = d3.keys(dataSet[0]).filter(function(key) {
			return key !== "date"; 
		}).map(function(name) {
		return {
			name: name,
			values: dataSet.map(function(d) {
				return {date: d.date, healthcontent: d.healthcontent};
			})
		};
	});
	

	createLittleVis();
	createBigVis();
});


var createLittleVis = function() {
	var xAxis, xScale, yAxis,  yScale;
	
	xScale = d3.time.scale().range([0, width - margin.left - margin.right]).domain([0, d3.max(dataSet, function(d) { 
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

	var line = d3.svg.line()
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
		.attr("d", function(d) {
			return line(d.values); 
		})
		.attr("stroke", "purple")
		.attr("fill", "none");
		
			
		
}



var createBigVis = function() {
		var xAxis, xScale, yAxis,  yScale;
	
	xScale = d3.time.scale().range([0, width - margin.left - margin.right]).domain([0, d3.max(dataSet, function(d) { 
		return d.date; 
	})]);
	yScale = d3.scale.linear().domain([d3.max(dataSet, function(d) { 
		return d.healthcontent; 
	}), 0]).range([0, bbDetail.h - margin.bottom]); 
	
	
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom");	
	var yAxis = d3.svg.axis().scale(yScale).orient("left");
	
	svg.append("g")
		.attr("id", "bigyaxis")
		.call(yAxis);
	svg.append("g")
		.attr("id", "bigxaxis")
		.attr("transform", "translate(0," + (bbDetail.h - margin.bottom) + ")")
		.call(xAxis);
}

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

