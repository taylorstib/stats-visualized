console.log('main.js loaded');

var data = [12, 3, 4, 10, 12, 7, 8, 2, 12, 3, 4, 5, 9, 21, 10, 3, 14, 7];
var svg = d3.select("#container").append("svg")
  .attr("height", 400)
  .attr("width", 400);
var w = 400;
var h = 300;
var barPadding = 1;
var offset = 8;
var xScale = d3.scale.linear();

svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return i * (w / data.length); //Bar width of 20 plus 1 for padding
  })
  .attr("y", function(d) {
    return h - (d * offset);
  })
  .attr("width", w / data.length - barPadding)
  .attr("height", function(d) {
    return d * offset;
  })
  .attr("fill", function(d) {
    return "rgb(0,0," + d * 14 + ")";
  });

// Add data value labels
svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(function(d) {
    return d * 8;
  })
  .attr("x", function(d, i) {
    return i * (w / data.length) + 4;
  })
  .attr("y", function(d) {
    return h - (d * offset) + 11;
  })
  .attr("font-size", "10px")
  .attr("fill", 'white');