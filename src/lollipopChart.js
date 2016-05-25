/**
 * Lollipop chart implementation.
 *
 * @class LollipopChart
 * @param {String} selection - any valid d3 selector. This selector is used to place the chart.
 * @return {LollipopChart}
 */
function LollipopChart(selection) {
  var chart = {};

  // settings
  var svgWidth = 250,
  svgHeight = 250,
  barGap = 5, 
  chartData = [],
  yScale = d3.scale.linear(),
  xScale = d3.scale.linear();

  // tell the chart how to access its data
  var valueAccessor = function(d) { return d.value; };
  var nameAccessor = function(d) { return d.name; };
  var comparisonValueAccessor = function(d) { return d.comparisonValue; };

  /**
   * Render the LollipopChart instance. Simply renders chart when called with no parameter. Updates data, then renders, if called with parameter
   * @method render
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [data]
   * @return {LollipopChart}
   */
  chart.render = function(_) {

    // initialize svg
    var svg = d3.select(selection).html('').append('svg');

    //if data is passed, update the chart data
    if(arguments.length) {
      chart.data(_);
    }

    // set the size of the svg
    svg.attr("width", svgWidth);
    svg.attr("height", svgHeight);

    svg.selectAll("rect")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("x", generateBarX)
      .attr("y", generateBarY)
      .attr("width", generateBarWidth)
      .attr("height", generateBarHeight)
  };

  /**
   * Get/set the data for the LollipopChart instance. Data should be in the form of an object containing min, max, and a data object containing an array of objects with name, value, and comparisonValue. Ex. {min: 5, max: 30, members: [{name: 'USA', value: 17, comparisonValue: 20}, {name: 'Canada', value: 14, comparisonValue: 10}]}
   * @method data
   * @memberof LollipopChart
   * @instance
   * @param  {Object} [data]
   * @return {Object} [Acts as getter if called with no parameter]
   * @return {LollipopChart} [Acts as setter if called with no parameter]
   */
  chart.data = function(_) {
    if(!arguments.length) return chartData;
    chartData = _;

    //initialize scales
    yScale.domain([d3.min(chartData, valueAccessor), d3.max(chartData, valueAccessor])
      .range(0, svgHeight);
    xScale.domain(0, chartData.length-1)
      .range(0, svgWidth);

    return chart;
  };

  chart.xScale = function(_) {
    if(!arguments.length) return xScale;
    chartData = _;

    return chart;
  };

  chart.yScale = function(_) {
    if(!arguments.length) return yScale;
    chartData = _;

    return chart;
  };

  chart.barWidth = function(_) {
    return generateBarWidth();
  };

  function generateBarX(d, i) {
    return xScale(i);
  }

  function generateBarY(d, i) {
    return generateBarHeight(d) - svgHeight;
  }

  chart.generateBarWidth = function(d) {
    return svgWidth / chartData.length - barGap; 
  }

  chart.generateBarHeight = function(d) {
    return yScale(d);
  };

  chart.generateLollipopHeight = function(d) {
    var adjustLollipopClipping(yScale(d));
  };

  // Check if the value would cause the lollipop to clip
  // Return the adjusted value
  function adjustLollipopClipping(value) {
    var clipExtentLow = clipExtentLow();
    var clipExtentHigh = clipExtentHigh();

    //value is inbetween lower extent
    if(value >= clipExtentLow[0] && value <= clipExtentLow[1]) return value + lollipopRadius;

    //value is inbetween higher extent
    if(value >= clipExtentHigh[0] && value <= clipExtentHigh[1]) return value - lollipopRadius;

    return value;
  }

  // Get the chart area where the lollipop will clip
  function clipExtentLow() {
    return [0, lollipopRadius];
  }

  function clipExtentHigh() {
    return [svgHeight - lollipopRadius, svgHeight];
  }

  chart.width = function(_) {
    if(!arguments.length) return svgWidth;
    svgWidth = _;

    return chart;
  };

  chart.height = function(_) {
    if(!arguments.length) return svgHeight;
    svgHeight = _;

    return chart;
  };

  chart.valueAccessor = function(_) {
    if(!arguments.length) return valueAccessor;
    valueAccessor = _;

    return chart;
  };

  chart.nameAccessor = function(_) {
    if(!arguments.length) return nameAccessor;
    nameAccessor = _;

    return chart;
  }

  chart.comparisonValueAccessor = function(_) {
    if(!arguments.length) return comparisonValueAccessor;
    comparisonValueAccessor = _;

    return chart; 
  };

  return chart;
}