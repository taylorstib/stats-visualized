console.log('main.js loaded');
d3.json("./data/passing/2014_passing_short.json", function(data){
  var w = $("#container").width();
  var h = 200;
  var svg = d3.select("#container").append("svg")
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
  console.log('Chart completed');
});

d3.json("./data/steps/steps.json", function(data){
  console.log(data);
  var w = $("#container").width();
  var h = 200;
  var svg = d3.select("#container").append("svg")
    .attr("height", h)
    .attr("width", w);
  var padding = 30;
  var barPadding = 1;
  var offset = 8;
  var xScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.steps; })]).range([0, w]);
  var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.steps; })]).range([0, h]);
  var good = 0;
  var okay = 0;
  var bad  = 0;

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * (w / data.length); //Bar width of 20 plus 1 for padding
    })
    .attr("y", function(d) {
      return h - yScale(d.steps);
    })
    .attr("width", w / data.length - barPadding)
    .attr("height", function(d) {
      return yScale(d.steps);
    })
    .attr("fill", function(d) {
      if (d.steps > 10000) {
        good += 1;
        return "rgb(0,200,0)";
      } else if (d.steps > 5000) {
        okay += 1;
        return "rgb(213, 217, 50)";
      } else {
        bad += 1;
        return "rgb(255, 0, 0)";
      }
    });
    
    console.log("good = " + good);
    console.log("okay = " + okay);
    console.log("bad = " + bad);
});
