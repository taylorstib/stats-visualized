// Bar graph of 2014 passing data
d3.json("./data/passing/2014_passing_short.json", function(data){
  var w = $("#container").width();
  var h = 200;
  var svg = d3.select("#passing-2014").append("svg")
    .attr("height", h)
    .attr("width", w);
  var padding = 30;
  var barPadding = 1;
  var offset = 8;
  var xScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.YDS; })]).range([0, w]);
  var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.YDS; })]).range([0, h]);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * (w / data.length); //Bar width of 20 plus 1 for padding
    })
    .attr("y", function(d) {
      return h - yScale(d.YDS);
    })
    .attr("width", w / data.length - barPadding)
    .attr("height", function(d) {
      return yScale(d.YDS);
    })
    .attr("fill", function(d) {
      return "rgb(" + Math.round(d.YDS / 20) + ",0,0)";
    });

  // Add data value labels
  svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d) {
      return d.YDS;
    })
    .attr("x", function(d, i) {
      return i * (w / data.length) + 4;
    })
    .attr("y", function(d) {
      return h - yScale(d.YDS) + 10;
    })
    .attr("font-size", "10px")
    .attr("fill", 'white');
    
  // svg.append("g").attr("class", 'axis').attr("transform", "translate(0,"+h+"").call(xAxis);
  // svg.append("g").attr("class", 'axis').attr("transform", "translate(18,0)").call(yAxis);
});
