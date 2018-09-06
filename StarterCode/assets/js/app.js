// Data which we will be using to build our chart
// d3.csv("assets/data/data.csv", function(error, data){
//   console.log(data);
// });
// d3.csv("assets/data/data.csv")
//    .then(data => {
//        console.log(data)
//    });
var margin = { top: 20, right: 20, bottom: 60, left: 60 },
  width = 800 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;
padding = 80;

// setup x 
var xValue = function (d) { return d.age; }, // data -> value
  xScale = d3.scale.linear().range([0, width]), // value -> display
  xMap = function (d) { return xScale(xValue(d)); }, // data -> display
  xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function (d) { return d.smokes; }, // data -> value
  yScale = d3.scale.linear().range([height, 0]), // value -> display
  yMap = function (d) { return yScale(yValue(d)); }, // data -> display
  yAxis = d3.svg.axis().scale(yScale).orient("left");


// add the graph canvas to the body of the webpage
var svg = d3.select('.scatter').append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

// load data
d3.csv("assets/data/data.csv", function (error, data) {

  // change string (from CSV) into number format
  data.forEach(function (d) {
    d.age = +d.age;
    d.smokes = +d.smokes;
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
  yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

  // x-axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + "," + (height - (padding / 3)) + ")")
    //   .attr("class", "label")
    //   .attr("x", width/2)
    .attr("y", +75)
    //   .attr("transform", "translate(0," + (height - padding) + ")")
    // .attr("y", height-6)
    .style("text-anchor", "middle")
    .text("Age");

  // y-axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    // .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Smokers");

  // draw dots
  svg.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .attr("class", "stateCircle")
    .attr("r", 10)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .on("mouseover", function (d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(d.state + "<br/> (" + xValue(d)
        + ", " + yValue(d) + ")")
        .style("left", (d3.event.pageX + 5) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
  
  // add labels to dots
  svg.append('g')
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('dx', xMap)
    .attr('dy', yMap)
    .attr("class", "stateText")
    .attr("font-size", "10px")
    .text(function (d) {
      return d.abbr
    })

});