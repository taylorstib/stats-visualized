// Do some set up before calling the data
var parseDate = d3.time.format("%m/%d/%Y").parse;
var parseMonth = d3.time.format("%m").parse;
var dateFormat = d3.time.format("%a %m/%d");
var parseWeek = d3.time.format("%U").parse;
var milSecPerDay = 864000000;

// set color Variables
var success_green = "rgba(0,200,0,1)";
var fail_grey = "rgba(153, 151, 151, 0.7)";

var margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;
var weeksChart = d3.select("#theChart").append("svg")

d3.json("./data/steps/steps.json" + '?' + Math.floor(Math.random() * 1000), function(data){
  var week = d3.time.format("%U");

  var nest = d3.nest()
      .key(function (d) {
      return week(new Date(d.date));
  })
      .entries(data);

  console.log(nest);
});