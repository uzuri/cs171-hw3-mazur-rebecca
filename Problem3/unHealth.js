var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

var width = 960 - margin.left - margin.right;

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
	for (i = 0; i < data.length; i++)
	{
		dataSet[i].date = parseDate(dataSet[i].date);
	}
	console.log(dataSet);
});

var convertToInt = function(s) {
    return parseInt(s.replace(/,/g, ""), 10);
};

