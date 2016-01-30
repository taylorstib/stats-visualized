// Do some set up before calling the data
var parseDate = d3.time.format("%m/%d/%Y").parse;
var parseMonth = d3.time.format("%m").parse;
var dateFormat = d3.time.format("%a %m/%d");
var milSecPerDay = 864000000;

// set color Variables
var success_green = "rgba(0,200,0,1)";
var fail_grey = "rgba(153, 151, 151, 0.7)";

var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
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
  
// MONTHS GRAPH SETUP
var months_width = 600; months_height = 200;

var months_chart = d3.select("#months").append("svg")
  .attr("height", months_height + margin.top + margin.bottom)
  .attr("width", months_width + margin.left + margin.right)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var barPadding = 0; monthBarPadding = 5;

// Variables to generate counts
var good = 0; okay = 0; bad  = 0; total = 0;
var good_min = 0; okay_min = 0; bad_min  = 0; total_min = 0;
var months_array = [];


// Bar graph of my daily steps
d3.json("./data/steps/steps.json" + '?' + Math.floor(Math.random() * 1000), function(data){

  var beginningDate = new Date('Dec 1, 2015');
  console.log(beginningDate);
  console.log(new Date(data[0].date));
  var filteredData = data.filter(function(d){
    return new Date(d.date).getTime() > beginningDate.getTime();
  });

// MONTHS GRAPH

  data.forEach(function(d) { d.dateM = parseMonth(d.date); });
  var nested = d3.nest()
    .key(function(d) {return parseMonth(d.date.split('/')[0]);})
    .rollup(function(leaves) {return {'sum': d3.sum(leaves, function(d) { return d.steps; }), 'average': d3.mean(leaves, function(d) { return d.steps; })};})
    .entries(data);
  // console.log(new Date(nested[0].key));
  nested.forEach(function(d){ months_array.push(Math.round(d.values.average)); });
  console.log(months_array);
  
  mXScale = d3.scale.ordinal()
    .domain(['May','June','July','August','September','October','November', 'December'])
    .rangePoints([0, months_width]);
  
  mYScale = d3.scale.linear().domain([0, d3.max(months_array, function(d){ return d; })]).range([months_height, 0]).nice();
  
  mYAxis = d3.svg.axis()
    .scale(mYScale)
    .tickSize(-width)
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
      return fail_grey;
    } else {
      return success_green;
    } });
  
  months_chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(mYAxis);
  // months_chart.append("g")
  //   .attr("class", "x axis")
  //   .attr("transform", "translate(0," + months_height +  ")")
  //   .call(mXAxis);

  
// STEPS GRAPHS
  
  // Parse the dates correctly
  data.forEach(function(d) { d.date = parseDate(d.date); });
  
  var xScale = d3.time.scale()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([0, width]);

  // Commented yscale uses the data to make it dynamic
  var yScale = d3.scale.linear().domain([d3.min(data, function(d){ return d.steps;}), d3.max(data, function(d){return d.steps ; })]).range([height, 0]).nice();
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
    .data(data, function(d){return d.date;})
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
        return success_green;
      } else {
        bad += 1;
        total += 1;
        return fail_grey;
      }
    })
    .on('click', function(d) {
      d3.select('#hover-date').text(dateFormat(d.date));
      d3.select('#hover-steps').text(d.steps);
      d3.select('#hover-minutes').text(d.minutes);
      d3.select('#hover-pace').text(d.steps_per_min);
    })
    .on('mouseover', function (d) {
      d3.select('#hover-date').text(dateFormat(d.date));
      d3.select('#hover-steps').text(d.steps);
      d3.select('#hover-minutes').text(d.minutes);
      d3.select('#hover-pace').text(d.steps_per_min);
    })
    .attr("stroke", function(d) {return '#eee';});
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height +  ")")
      .call(xAxis);

    d3.select("#good").text("good = " + good + " = "+ Math.round(good/total * 100) + "%");
    // d3.select("#okay").text("okay = "+okay + " = "+ Math.round(okay/total * 100) + "%");
    d3.select("#bad").text("bad = "+bad + " = "+ Math.round(bad/total * 100) + "%");
    d3.select("#total").text("Total = "+ total + " = 100%").style({"font-weight": "bold", "border-top": "2px solid black", "padding-top": "8px"});


// MINUTES GRAPHS
  var xMinScale = d3.time.scale()
    .range([0, width])
    .domain(d3.extent(data, function(d) { return d.date; }));

  // var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.minutes; })]).range([height, 0]);
  var yMinScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.minutes; })]).range([height, 0]).nice();
  

  // generate y axis
  var yMinAxis = d3.svg.axis()
      .scale(yMinScale)
      .tickSize(-width)
      .orient("left");
  
  var xMinAxis = d3.svg.axis()
    .scale(xMinScale)
    .orient("bottom");

  svg_min.selectAll("rect")
    .data(data, function(d){return d.date;})
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
      if (d.minutes > 75) {
        good_min += 1;
        total_min += 1;
        return success_green;
      } else if (d.minutes > 50) {
        okay_min += 1;
        total_min += 1;
        return fail_grey;
      } else if (d.minutes > 0) {
        bad_min += 1;
        total_min += 1;
        return fail_grey;
      }
    })
    .on('click', function(d) {
      d3.select('#hover-date').text(dateFormat(d.date));
      d3.select('#hover-steps').text(d.steps);
      d3.select('#hover-minutes').text(d.minutes);
      d3.select('#hover-pace').text(d.steps_per_min);
    })
    .on('mouseover', function (d) {
      d3.select('#hover-date').text(dateFormat(d.date));
      d3.select('#hover-steps').text(d.steps);
      d3.select('#hover-minutes').text(d.minutes);
      d3.select('#hover-pace').text(d.steps_per_min);
    })
    .attr("stroke", function(d) {return '#eee';});

    svg_min.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yMinAxis);
      
    svg_min.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height +  ")")
      .call(xMinAxis);

    d3.select("#good_min").text("good = " + good_min + " = "+ Math.round(good_min/total_min * 100) + "%");
    // d3.select("#okay_min").text("okay = "+okay_min + " = "+ Math.round(okay_min/total_min * 100) + "%");
    d3.select("#bad_min").text("bad = "+bad_min + " = "+ Math.round(bad_min/total_min * 100) + "%");
    d3.select("#total_min").text("Total = "+ total_min + " = 100%").style({"font-weight": "bold", "border-top": "2px solid black", "padding-top": "8px"});

    d3.select("#step-pie").text(good + "," + okay + "," + bad);
    d3.select("#min-pie").text(good_min + "," + okay_min + "," + bad_min);
    $('.pie').peity("pie");
    
});

function renderMonth(month){
  
  // Variables to generate counts
  var good = 0; okay = 0; bad  = 0; total = 0; blank_days = 0;
  var good_min = 0; okay_min = 0; bad_min  = 0; total_min = 0; blank_days_mins = 0;
  

  console.log("rendering "+month);
    d3.json("./data/steps/"+month+".json" + '?' + Math.floor(Math.random() * 1000), function(data){

      data.forEach(function(d) { d.date = parseDate(d.date); });
      var xScale = d3.time.scale()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([0, width]);
      var yScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.steps ; })]).range([height, 0]).nice();
      
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize(-width)
        .ticks(10);
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
      
      // Min Variables
      var xMinScale = d3.time.scale()
        .domain(d3.extent(data, function(d) { return d.date; }))
        .range([0, width]);
      var yMinScale = d3.scale.linear().domain([0, d3.max(data, function(d){return d.minutes; })]).range([height, 0]).nice();
      // generate y axis
      var yMinAxis = d3.svg.axis()
          .scale(yMinScale)
          .tickSize(-width)
          .orient("left");
      var xMinAxis = d3.svg.axis()
        .scale(xMinScale)
        .orient("bottom");


      var bars = svg.selectAll("rect")
        .data(data, function(d){
          return d.date;
        });
      var minBars = svg_min.selectAll('rect')
        .data(data, function (d) {
          return d.date;
        });

      bars.transition()
        .attr("x", function(d, i) { return (i * (width / data.length)); })
        .attr("y", function(d) { return yScale(d.steps); })
        .attr("width", width / data.length - barPadding)
        .attr("height", function(d) { return height - yScale(d.steps); })
        .attr("fill", function(d) {
          if (d.steps > 10000) {
            return success_green;
          } else if (d.steps > 6000) {
            return fail_grey;
          } else {
            return fail_grey;
          }
        })
        .attr("stroke", function(d) {return '#eee';});

      bars.enter()
        .append('rect')
        .attr("x", function(d, i) { return (i * (width / data.length)); })
        .attr("y", function(d) { return yScale(d.steps); })
        .attr("width", width / data.length - barPadding)
        .attr("height", function(d) { return height - yScale(d.steps); })
        .attr("fill", function(d) {
          if (d.steps > 10000) {
            return success_green;
          } else if (d.steps > 6000) {
            return fail_grey;
          } else {
            return fail_grey;
          }
        })
        .on('click', function(d){
          d3.select('#hover-date').text(dateFormat(d.date));
          d3.select('#hover-steps').text(d.steps);
          d3.select('#hover-minutes').text(d.minutes);
          d3.select('#hover-pace').text(d.steps_per_min);
        })
        .on("mouseover", function(d) {
          //Place the data in the table
          d3.select('#hover-date').text(dateFormat(d.date));
          d3.select('#hover-steps').text(d.steps);
          d3.select('#hover-minutes').text(d.minutes);
          d3.select('#hover-pace').text(d.steps_per_min);
        })
        .attr("stroke", function(d) {return '#eee';});
      
      bars.exit().remove();
      
      minBars.transition()
        .attr("x", function(d, i) { return (i * (width / data.length)); })
        .attr("y", function(d) { return yMinScale(d.minutes); })
        .attr("width", width / data.length - barPadding)
        .attr("height", function(d) { return height - yMinScale(d.minutes); })
        .attr("fill", function(d) {
          if (d.minutes > 75) {
            return success_green;
          } else if (d.minutes > 50) {
            return fail_grey;
          } else {
            return fail_grey;
          }
        })
        .attr("stroke", function(d) {return '#eee';});

      minBars.enter()
        .append('rect')
        .attr("x", function(d, i) { return (i * (width / data.length)); })
        .attr("y", function(d) { return yMinScale(d.minutes); })
        .attr("width", width / data.length - barPadding)
        .attr("height", function(d) { return height - yMinScale(d.minutes); })
        .attr("fill", function(d) {
          if (d.minutes > 75) {
            return success_green;
          } else if (d.minutes > 50) {
            return fail_grey;
          } else {
            return fail_grey;
          }
        })
        .on('click', function(d){
          d3.select('#hover-date').text(dateFormat(d.date));
          d3.select('#hover-steps').text(d.steps);
          d3.select('#hover-minutes').text(d.minutes);
          d3.select('#hover-pace').text(d.steps_per_min);
        })
        .on("mouseover", function(d) {
           //Place the data in the table
           d3.select('#hover-date').text(dateFormat(d.date));
           d3.select('#hover-steps').text(d.steps);
           d3.select('#hover-minutes').text(d.minutes);
           d3.select('#hover-pace').text(d.steps_per_min);
          })
        .attr("stroke", function(d) {return '#eee';});
      
      minBars.exit().remove();
        
      svg.select(".y.axis")
        .transition()
        .call(yAxis);
      svg.select(".x.axis")
        .transition()
        .call(xAxis);

      data.forEach(function(d) {
        if (d.steps === null) {
          blank_days += 1;
        }
        else if (d.steps > 10000) {
          good += 1;
          total += 1;
        } else {
          bad += 1;
          total += 1;
        }
       });
       data.forEach(function(d) {
         if (d.minutes === null) {
           blank_days_mins += 1;
         }
         else if (d.minutes > 75) {
           good_min += 1;
           total_min += 1;
         } else {
           bad_min+= 1;
           total_min += 1;
         }
        });
        d3.select("#good").text("good = " + good + " = "+ Math.round(good/total * 100) + "%");
        // d3.select("#okay").text("okay = "+okay + " = "+ Math.round(okay/total * 100) + "%");
        d3.select("#bad").text("bad = "+bad + " = "+ Math.round(bad/total * 100) + "%");
        d3.select("#total").text("Total = "+ total + " = 100%").style({"font-weight": "bold", "border-top": "2px solid black", "padding-top": "8px"});
        d3.select("#step-pie").text(good + "," + okay + "," + bad);
        
        d3.select("#good_min").text("good = " + good_min + " = "+ Math.round(good_min/total_min * 100) + "%");
        // d3.select("#okay_min").text("okay = "+okay_min + " = "+ Math.round(okay_min/total_min * 100) + "%");
        d3.select("#bad_min").text("bad = "+bad_min + " = "+ Math.round(bad_min/total_min * 100) + "%");
        d3.select("#total_min").text("Total = "+ total_min + " = 100%").style({"font-weight": "bold", "border-top": "2px solid black", "padding-top": "8px"});
        d3.select("#min-pie").text(good_min + "," + okay_min + "," + bad_min);
        $('.pie').peity("pie");

  });
}