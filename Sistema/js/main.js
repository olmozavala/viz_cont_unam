var svg; 
var margin = 10;
var projection;
var path;
var data;
var dataGeo = {};

(function(){
	
	var width = window.innerWidth - 2*margin;
	var height= window.innerHeight - 2*margin;
	projection = d3.geo.mercator()
			.scale(2299000)
	// Center the Map in Mexico City
			.center([-99.1772, 19.330])
			.translate([width / 2, height / 2]);
	
	path = d3.geo.path().projection(projection);
	
	svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "svgBase");
	
//	d3.json('Datos/MapsGeoJson/Edificios.json', function(data) {
	d3.json('Datos/MapsGeoJson/CU.json', function(data) {
		var features = data.features;
		//		console.log(features[0]);
		
		// Iterates over the data and draws something
		var baseLayersGrp = svg.append('g').attr('class', 'boundary');
		
		baseLayersGrp.selectAll('path').data(features)
				.enter().append('path')
				.attr('d', path);
		//			  .on('mouseover', mouseoverDep);
		readData();
	});
})();


function readFile(fileName, dataId){
	d3.csv(fileName, function(data) {
		
		dataGeo[dataId] = data;
		/*
		dataGeo[attr] = {};
		dataGeo.bicOne.type = "FeatureCollection";
		dataGeo.crs = {properties: {name:"urn:ogc:def:crs:OGC:1.3:CRS84"}};
		dataFeatures = data.map( obj => {
							var res = {}; 
							res.type = "Feature";
							res.properties = {date:obj.date};
							res.geometry = {type:"Point",
											coordinates:[obj.lon, obj.lat]};
							return res;
						});
		dataGeo.features = dataFeatures;*/
		
		// Iterates over the data and draws something
	});
}

function drawRoute(dataId){
	
	svg.selectAll('circle').remove();
	var baseLayersGrp = svg.append('g').attr('class', 'bici');
	
	baseLayersGrp.selectAll('circle').data(dataGeo[dataId])
			.enter().append('circle')
			.attr('cx', function(d){ return projection([d.lon,d.lat])[0];})
			.attr('cy', function(d){ return projection([d.lon,d.lat])[1];})
			.attr('r',1);
	
}
/**
 * This function should read and plot all the data to display 
 * @returns {undefined}
 */
function readData(){
	readFile('Datos/CO/1_bicicleta.csv', 'bici1');
	readFile('Datos/CO/2_bicicleta.csv', 'bici2');
	readFile('Datos/CO/3_bicicleta.csv', 'bici3');
	
	readFile('Datos/CO/1_caminando.csv', 'cam1');
	readFile('Datos/CO/2_caminando.csv', 'cam2');
	readFile('Datos/CO/3_caminando.csv', 'cam3');
	
	readFile('Datos/CO/1_pumabus.csv', 'bus1');
	readFile('Datos/CO/2_pumabus.csv', 'bus2');
	readFile('Datos/CO/3_pumabus.csv', 'bus3');
}

//Button TODO make it nicer. 
$("#bici1").click(function() { drawRoute('bici1'); });
$("#bici2").click(function() { drawRoute('bici2'); });

function resizeMap(width, height){
	svg.attr("width", width)
			.attr("height", height);
	path.projection()
			.center([-99.1792, 19.32])
			.translate([width / 2, height / 2]);
	
	// Iterates over the data and draws something
	d3.selectAll('path').attr('d', path);
	d3.selectAll('circle').attr('d', path);
}

function mouseoverDep(){
	console.log("mouseoverDep");
}

$(window).resize(function(){
	var width = window.innerWidth - 2*margin;
	var height= window.innerHeight - 2*margin;
	resizeMap(width, height);
})