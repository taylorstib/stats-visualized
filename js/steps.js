// Do some set up before calling the data
var parseDate = d3.time.format("%m/%d/%Y").parse;
console.log(parseDate("8/26/2015"));

var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var svg = d3.select("#steps").append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg_min = d3.select("#minutes").append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
////////////////////////////////////////////////////////////////////////////////
var months_width = 400;
var months_height = 150;
var months_chart = d3.select("#april").append("svg")
  .attr("height", months_height + margin.top + margin.bottom)
  .attr("width", months_width + margin.left + margin.right)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/////////////////////////////////////////////////////////////////////////////////
  

var barPadding = 1;
var monthBarPadding = 4;

// Variables to generate counts
var good = 0;
var okay = 0;
var bad  = 0;
var total = 0;

var good_min = 0;
var okay_min = 0;
var bad_min  = 0;
var total_min = 0;

var months_array = [];
// Bar graph of my daily steps
d3.json("./data/steps/steps.json", function(data){
  
  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  // Better way of grouping data by month. Also produces a sum of steps for the month
  var nested = d3.nest()
    .key(function(d) {return d.date.split('/')[0];})
    .rollup(function(leaves) {return {'sum': d3.sum(leaves, function(d) { return d.steps; }), 'average': d3.mean(leaves, function(d) { return d.steps; })};})
    .entries(data);
    
  nested.forEach(function(d){ months_array.push(d.values.average); });
  console.warn(months_array);
  
  mXScale = d3.scale.ordinal()
    .domain([4, 8])
    .range([0, months_width]);
    
  mYScale = d3.scale.linear().domain([0, d3.max(months_array, function(d){ return d; })]).range([months_height, 0]).nice();
  
  mYAxis = d3.svg.axis()
    .scale(mYScale)
    .orient("left");
    
  mXAxis = d3.svg.axis()
    .scale(mXScale)
    .orient("bottom");
    
  months_chart.selectAll("rect")
    .data(months_array)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return (i * (months_width / months_array.length)); })
    .attr("y", function(d) { return mYScale(d); })
    .attr("width", months_width / months_array.length - monthBarPadding)
    .attr("height", function(d) { return months_height - mYScale(d); })
    .attr("fill", function(d, i){ if (d < 5500) {
      return "rgba(255, 0, 0, .7)";
    } else {
      return "rgba(0, 255, 40, .7)";
    } });
  
  months_chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(mYAxis);
  months_chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + months_height +  ")")
    .call(mXAxis);

  ////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////
  
  // Parse the dates correctly
  data.forEach(function(d) { d.date = parseDate(d.date); });
  
  var xScale = d3.time.scale()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([0, width]);

  
  // Commented yscale uses the data to make it dynamic
  var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.steps ; })]).range([height, 0]).nice();
  // var yScale = d3.scale.linear().domain([0, 16000]).range([height, 0]);
  

  // generate y axis
  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .tickSize(-width)
    .ticks(10);
  
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { return (i * (width / data.length)); })
    .attr("y", function(d) { return yScale(d.steps); })
    .attr("width", width / data.length - barPadding)
    .attr("height", function(d) { return height - yScale(d.steps); })
    .attr("fill", function(d) {
      if (d.steps > 10000) {
        good += 1;
        total += 1;
        return "rgba(0,200,0,1)";
      } else if (d.steps > 6000) {
        okay += 1;
        total += 1;
        return "rgba(213, 217, 50,1)";
      } else {
        bad += 1;
        total += 1;
        return "rgba(255, 0, 0, .7)";
      }
    });
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height +  ")")
      .call(xAxis);

    d3.select("#good").text("good = " + good + " = "+ Math.round(good/total * 100) + "%");
    d3.select("#okay").text("okay = "+okay + " = "+ Math.round(okay/total * 100) + "%");
    d3.select("#bad").text("bad = "+bad + " = "+ Math.round(bad/total * 100) + "%");

  var xMinScale = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(data, function(d) { return d.date; }));

  // var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.minutes; })]).range([height, 0]);
  var yMinScale = d3.scale.linear().domain([0, 160]).range([height, 0]);
  

  // generate y axis
  var yMinAxis = d3.svg.axis()
      .scale(yMinScale)
      .tickSize(-width)
      .orient("left");
  
  var xMinAxis = d3.svg.axis()
    .scale(xMinScale)
    .orient("bottom");

  svg_min.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return (i * (width / data.length)); 
    })
    .attr("y", function(d) {
      return yMinScale(d.minutes);
    })
    .attr("width", width / data.length - barPadding)
    .attr("height", function(d) {
      return height - yMinScale(d.minutes);
    })
    .attr("fill", function(d) {
      if (d.minutes > 90) {
        good_min += 1;
        total_min += 1;
        return "rgba(0,200,0,.7)";
      } else if (d.minutes > 60) {
        okay_min += 1;
        total_min += 1;
        return "rgba(213, 217, 50,.7)";
      } else if (d.minutes > 0) {
        bad_min += 1;
        total_min += 1;
        return "rgba(255, 0, 0,.4)";
      }
    });

    svg_min.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yMinAxis);
      
    svg_min.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height +  ")")
      .call(xMinAxis);

    d3.select("#good_min").text("good = " + good_min + " = "+ Math.round(good_min/total_min * 100) + "%");
    d3.select("#okay_min").text("okay = "+okay_min + " = "+ Math.round(okay_min/total_min * 100) + "%");
    d3.select("#bad_min").text("bad = "+bad_min + " = "+ Math.round(bad_min/total_min * 100) + "%");

    d3.select("#step-pie").text(good + "," + okay + "," + bad);
    d3.select("#min-pie").text(good_min + "," + okay_min + "," + bad_min);
    $('.pie').peity("pie");
    
});