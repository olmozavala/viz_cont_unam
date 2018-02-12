/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var width = 400;
var height = 400;
var bardata =  d3.range(0,20) ;

var barWidth = 40;
var barHeight = 100;
var barOffset = 5;


d3.select('svg')
		.attr('width',width)
		.attr('height',height)

var mysvg = d3.select('svg');
addRectangle(mysvg);
appendBarchar(mysvg);

function addRectangle(obj){
	obj.append("rect")
			.attr('x',100)
			.attr('y',100)
			.attr('width',100)
			.attr('height',100)
			.style('fill','green');
}

function appendBarchar(obj){

	// Scale examples
	// Linear scale 
	var yValues = d3.scaleLinear()
			.domain([0, d3.max(bardata)])
			.range([0, barHeight]);
	
	// Linear scale for colors
	var colors = d3.scaleLinear()
			.domain([0, d3.max(bardata)*.55, d3.max(bardata)])
			.range(['#0000FF', '#FFFF00', '#FF0000']);

	// Positions of the rectangles
	var xPositions = d3.scaleBand()
			.domain(d3.range(0,bardata.length))
			.rangeRound([0, width-10]);
	
	//The frist 3 lines are the weird ones. You first select
	// all the rectangles that doesn't exist and then you append
	// them on the svg object
	obj.selectAll('rect')
			.data(bardata)
			.enter().append('rect')
			.style('fill', function(d){
				return colors(d);
				})
			.attr('width', xPositions.bandwidth())
			.attr('height', function(d){
				return yValues(d);
				})
			.attr('x', function(d,i){
//				console.log(d);
//				console.log(xPositions(i));
				return xPositions(i);
				})
			.attr('y', function(d,i){
				return 200 + barHeight - yValues(d);
				})
            .on('mouseover', function(d){
                d3.select(this)
                    .style('opacity',.5);
            })
            .on('mouseout', function(d){
                d3.select(this)
                    .style('opacity',1);
            })

}

var t = d3.scaleLinear()
    .domain([0,15])
    .range([-15, 50]);

var t2 = d3.scaleLinear()
    .domain([0,15])
    .rangeRound([-15, 50]);
	
var t3 = d3.scaleBand()
    .domain([0,15])
    .range([-15, 50]);
	
var minPalVal = -15;
var maxPalVal = 50;
var barWidth = 515;

var linScale = d3.scaleLinear()
		.domain([Number(minPalVal), Number(maxPalVal)])
		.range([0, 1]);

var myNumbers = linScale.ticks(8);

//This linear scale is used to obtain the positions
// where we will writhe the numbers 
var linScalePos = d3.scaleLinear()
		.domain([Number(minPalVal), Number(maxPalVal)])
		.range([0, barWidth]);

var myPos = myNumbers.map(function(element){
				return linScalePos(element); }) ;

myNumbers.forEach(function(element){
				console.log(element);
				console.log(linScalePos(element)); 
				return linScalePos(element); }) ;
