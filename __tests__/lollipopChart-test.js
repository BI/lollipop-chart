jest.unmock('../src/lollipopChart.js');
jest.unmock('../node_modules/d3/d3.js')

d3 = require('../node_modules/d3/d3.js');
var LollipopChart = require('../src/lollipopChart.js')('#test');

var data = {
  min: 5,
  max: 100,
  members: [
    {country: 'Afghanistan', value: 80, average: 60},
    {country: 'Bangladesh', value: 50, average: 50},
    {country: 'Bhutan', value: 5, average: 35},
    {country: 'India', value: 100, average: 55},
    {country: 'Maldives', value: 25, average: 30},
    {country: 'Nepal', value: 35, average: 40},
    {country: 'Pakistan', value: 50, average: 60},
    {country: 'Sri Lanka', value: 65, average: 50},
  ]};
var HEIGHT = 200, WIDTH = 100, BAR_GAP = 5;
LollipopChart
  .width(WIDTH)
  .height(HEIGHT)
  .barGap(BAR_GAP)
  .nameAccessor(function(d) { return d.country; })
  .comparisonValueAccessor(function(d) { return d.average; })
  .data(data);

var yScale = d3.scale.linear()
  .domain([d3.min(data.members, LollipopChart.valueAccessor()), d3.max(data.members, LollipopChart.valueAccessor())])
  .range([0, HEIGHT]);

describe('LollipopChart', function() {

  // All of the unit tests for data calculations go here separate from the svg rendering
  describe('chart calculations', function() {

    it('should have a height set for the chart', function() {
      expect(LollipopChart.height()).toEqual(HEIGHT);
    });

    it('should have a width set for the chart', function() {
      expect(LollipopChart.width()).toEqual(WIDTH);
    });

    it('should calculate bar height correctly for the comparisonValue of Bangladesh', function() {
      var comparisonValue = LollipopChart.comparisonValueAccessor()(getObject('Bangladesh', LollipopChart.nameAccessor()));
      var expectedBarHeight = yScale(comparisonValue);
      var generatedBarHeight = LollipopChart.generateBarHeight(comparisonValue);

      expect(generatedBarHeight).toEqual(expectedBarHeight);
    });

    it('should calculate bar width correctly taking into account bar gaps', function() {
      var expectedBarWidth = WIDTH / data.members.length - BAR_GAP;
      var generatedBarWidth = LollipopChart.generateBarWidth();

      expect(generatedBarWidth).toEqual(expectedBarWidth);
    });

    it('should set the lollipop height above the bar for a value above its comparisonValue like for Afghanistan', function() {
      var heights = generatedHeights('Afghanistan', LollipopChart.nameAccessor());
      var lollipopHeight = heights.lollipopHeight;
      var barHeight = heights.barHeight;

      expect(lollipopHeight).toBeGreaterThan(barHeight);
    });

    it('should set the lollipop height below the bar for a value below its comparisonValue like for Maldives', function() {
      var heights = generatedHeights('Maldives', LollipopChart.nameAccessor());
      var lollipopHeight = heights.lollipopHeight;
      var barHeight = heights.barHeight;

      expect(lollipopHeight).toBeLessThan(barHeight);
    });

    it('should set the lollipop at the same height as the bar if the value is equal to the comparisonValue like for Bangladesh', function() {
      var heights = generatedHeights('Bangladesh', LollipopChart.nameAccessor());
      var lollipopHeight = heights.lollipopHeight;
      var barHeight = heights.barHeight;

      expect(lollipopHeight).toEqual(barHeight);
    });

    it('should set the lollipop height at the top of the chart(and not clipped) for a value that is equal to the max like India', function() {
      var generatedLollipopHeight = generatedHeights('India', LollipopChart.nameAccessor()).lollipopHeight;
      var radius = LollipopChart.lollipopRadius();
      var expectedLollipopHeight = HEIGHT - radius;

      expect(generatedLollipopHeight).toEqual(expectedLollipopHeight);
    });

    it('should set the lollipop height at the bottom of the chart(and not clipped) for a value that is equal to the min', function() {
      var generatedLollipopHeight = generatedHeights('Bhutan', LollipopChart.nameAccessor()).lollipopHeight;
      var radius = LollipopChart.lollipopRadius();
      var expectedLollipopHeight = 0 + radius;

      expect(generatedLollipopHeight).toEqual(expectedLollipopHeight);
    });

    it('should color code the lollipops', function() {
      var generatedColorScale = LollipopChart.colorScale();
      var expectedColorScale = d3.scale.category10().domain(data.members.map(LollipopChart.nameAccessor()));

      expect(generatedColorScale('Bhutan')).toEqual(expectedColorScale('Bhutan'));
    });

    it('should have the ability to use custom data accessors', function() {
      //Example use of the accessor
      var listOfComparisonValues = data.members.map(LollipopChart.comparisonValueAccessor());

      expect(listOfComparisonValues[2]).toEqual(data.members[2].average);
    });

  });

  // All of the unit tests to show that the chart is correctly rendered go here
  // Not sure if this is needed yet
  describe('chart rendering', function() {

    beforeEach(function() {
      // LollipopChart.render();
    });

  });
  
});

//helper functions
function getObject(memberValue, accessorFunc) {
  var memberIndex = data.members.map(accessorFunc).indexOf(memberValue);

  return data.members[memberIndex];
}

function generatedHeights(memberValue, accessorFunc) {
  var value = LollipopChart.valueAccessor()(getObject(memberValue, accessorFunc));
  var comparisonValue = LollipopChart.comparisonValueAccessor()(getObject(memberValue, accessorFunc));
  var lollipopHeight = LollipopChart.generateLollipopHeight(value);
  var barHeight = LollipopChart.generateBarHeight(comparisonValue);

  return {barHeight: barHeight, lollipopHeight: lollipopHeight};
}