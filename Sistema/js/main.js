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
		// Iterates over the data and draws something
		var baseLayersGrp = svg.append('g').attr('class', 'boundary');
		
		baseLayersGrp.selectAll('path').data(features)
				.enter().append('path')
				.attr('d', path);
		//			  .on('mouseover', mouseoverDep);
		readData();
	});
})();


/* This function is used to read all the files */
function readFile(fileName, dataId){
	d3.csv(fileName, function(data) {
		dataGeo[dataId] = data;
	});
}

/* This function draws the selected route */
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
	readFile('Datos/CO/1_bicicleta.csv', 'cobici1');
	readFile('Datos/CO/2_bicicleta.csv', 'cobici2');
	readFile('Datos/CO/3_bicicleta.csv', 'cobici3');
	
	readFile('Datos/CO/1_caminando.csv', 'cocam1');
	readFile('Datos/CO/2_caminando.csv', 'cocam2');
	readFile('Datos/CO/3_caminando.csv', 'cocam3');
	
	readFile('Datos/CO/1_pumabus.csv', 'cobus1');
	readFile('Datos/CO/2_pumabus.csv', 'cobus2');
	readFile('Datos/CO/3_pumabus.csv', 'cobus3');

	readFile('Datos/PM25/1_bicicleta.csv', 'pmbici1');
	readFile('Datos/PM25/2_bicicleta.csv', 'pmbici2');
	readFile('Datos/PM25/3_bicicleta.csv', 'pmbici3');
	
	readFile('Datos/PM25/1_caminando.csv', 'pmcam1');
	readFile('Datos/PM25/2_caminando.csv', 'pmcam2');
	readFile('Datos/PM25/3_caminando.csv', 'pmcam3');
	
	readFile('Datos/PM25/1_pumabus.csv', 'pmbus1');
	readFile('Datos/PM25/2_pumabus.csv', 'pmbus2');
	readFile('Datos/PM25/3_pumabus.csv', 'pmbus3');
}

/**
 * This function should resize the map so that it fits nicely on the screen 
 * @param {type} width
 * @param {type} height
 * @returns {undefined}
 */
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

//intento para mover un punto en el mapa :)
//si se pudo era facil
//logro su objetivo, pero hay que optimizar
function moveToPosition() {
    return function(obj1, obj2) {
        svg.selectAll('circle').remove();
        var i = 0;
        var j = 0;
        svg.selectAll("circle").data([obj1, obj2])
                        .enter().append('circle')
                        .attr('cx', function(d){ return projection([d.lon,d.lat])[0];})
                        .attr('cy', function(d){ return projection([d.lon,d.lat])[1];})
                        .attr('r', function() {
                                var r = j === 0 ? 5 : 10;
                                j++;
                                return r;})
                        .attr('class', function() {
                                var re = i === 0 ? 'point-graph' : 'point-second-graph';
                                i++;
                                return re;});
    }
}
       
        


$(window).resize(function(){
	console.log("Risizing map...");
	var width = window.innerWidth - 2*margin;
	var height= window.innerHeight - 2*margin;
	resizeMap(width, height);
})