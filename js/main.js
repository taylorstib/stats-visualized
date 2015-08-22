// Do some set up before calling the data
var parseDate = d3.time.format("%m/%d/%Y").parse;
console.log(parseDate("8/4/2015"));

var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var svg = d3.select("#steps").append("svg")
  .attr("height", height + margin.top + margin.bottom)
  .attr("width", width + margin.left + margin.right)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var barPadding = 1;

// Variables to generate counts
var good = 0;
var okay = 0;
var bad  = 0;
var total = 0;
// Bar graph of my daily steps
d3.json("./data/steps/steps.json", function(data){
  
  // Parse the dates correctly
  data.forEach(function(d) {
    d.date = parseDate(d.date);
  });
  // var w = $("#container").width();
  // var h = 200;
  var xScale = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(data, function(d) { return d.date; }));
  
  console.log(d3.extent(data, function(d){ return d.date; }));
    
  // var xScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.steps; })]).range([0, width]);
  var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.steps; })]).range([height, 0]);
  

  // generate y axis
  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left");
  
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return (i * (width / data.length)); 
    })
    .attr("y", function(d) {
      return yScale(d.steps);
    })
    .attr("width", width / data.length - barPadding)
    .attr("height", function(d) {
      return height - yScale(d.steps);
    })
    .attr("fill", function(d) {
      if (d.steps > 8000) {
        good += 1;
        total += 1;
        return "rgb(0,200,0)";
      } else if (d.steps > 5000) {
        okay += 1;
        total += 1;
        return "rgb(213, 217, 50)";
      } else {
        bad += 1;
        total += 1;
        return "rgb(255, 0, 0)";
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
});