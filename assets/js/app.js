var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(generalData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    generalData.forEach(function(data) {
      data.income = +data.income;
      data.poverty = +data.poverty;
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(generalData, d => d.income) -1000, d3.max(generalData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(generalData, d => d.poverty) + 5])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(generalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".5");

    var circlesText = chartGroup.selectAll(null)
    .data(generalData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d.income))
    .attr("dy", d => yLinearScale(d.poverty))
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text(function(d) {return d.abbr; });


    // Initialize tool tip
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>Income: ${d.income}<br>Poverty: ${d.poverty}`);
      });

    // Create tooltip in the chart
    chartGroup.call(toolTip);

    // Create event listeners to display and hide the tooltip
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    circlesText.on("click", function(data){
      toolTip.show(data,this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
      .attr("class", "axisText")
      .text("Income");
  }).catch(function(error) {
    console.log(error);
  });
