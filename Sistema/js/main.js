var svg; 
var margin = 10;
var projection;
var path;
var data;
var dataGeo = {};
var center = [-99.1802, 19.328];

// Hardcoded way to decide the scale of the map 
function getMapScale(width,height){
	return 2839000*(Math.min(width,height)/1300);
}

(function(){
        $('#graph-main').addClass('blur');
	var width = $("#map").width();
	var height= window.innerHeight - 2*margin;
	projection = d3.geo.mercator()
			.scale(getMapScale(width,height))
	// Center the Map in Mexico City
			.center(center)
			.translate([width / 2, height / 2]);
	
	path = d3.geo.path().projection(projection);
	
	svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("id", "svgBase");

	readData();
})();

/* This function draws the selected route */
function drawRoute(cont, time, jorney){
	var dataId = cont+jorney+time;
	
	//TODO this should be done with premises
	if(!_.isEmpty(dataGeo)){
		console.log("Drawing route for ", dataId);
		var baseLayersGrp;
		svg.selectAll('.route').remove();
		baseLayersGrp = svg.append('g').attr('class', 'route');
		baseLayersGrp.selectAll('circle').data(dataGeo[dataId])
				.enter().append('circle')
				.attr('cx', function(d){ return projection([d.lon,d.lat])[0];})
				.attr('cy', function(d){ return projection([d.lon,d.lat])[1];})
				.attr('r',1);
	}
	
}

/* This function is used to read all the files */
function readFile(fileName, dataId){
	return new Promise(function (resolve, reject){ 
		d3.csv(fileName , function(error, data) {
			if(error){
				reject(error);
			}else{
				dataGeo[dataId] = data;
				resolve('Success for '+dataId);
			} });
		});
}


/**
 * This function should read and plot all the data to display 
 * @returns {undefined}
 */
function readData(){
	var promArr = [];//Using promises to catch when all the files have been read
	promArr.push(readFile('Datos/CO/1_bicicleta.csv', 'CObicicleta1'));
	promArr.push(readFile('Datos/CO/2_bicicleta.csv', 'CObicicleta2'));
	promArr.push(readFile('Datos/CO/3_bicicleta.csv', 'CObicicleta3'));
	
	promArr.push(readFile('Datos/CO/1_caminando.csv', 'COcaminando1'));
	promArr.push(readFile('Datos/CO/2_caminando.csv', 'COcaminando2'));
	promArr.push(readFile('Datos/CO/3_caminando.csv', 'COcaminando3'));
	
	promArr.push(readFile('Datos/CO/1_pumabus.csv', 'COpumabus1'));
	promArr.push(readFile('Datos/CO/2_pumabus.csv', 'COpumabus2'));
	promArr.push(readFile('Datos/CO/3_pumabus.csv', 'COpumabus3'));

	promArr.push(readFile('Datos/PM25/1_bicicleta.csv', 'PM25bicicleta1'));
	promArr.push(readFile('Datos/PM25/2_bicicleta.csv', 'PM25bicicleta2'));
	promArr.push(readFile('Datos/PM25/3_bicicleta.csv', 'PM25bicicleta3'));
	
	promArr.push(readFile('Datos/PM25/1_caminando.csv', 'PM25caminando1'));
	promArr.push(readFile('Datos/PM25/2_caminando.csv', 'PM25caminando2'));
	promArr.push(readFile('Datos/PM25/3_caminando.csv', 'PM25caminando3'));
	
	promArr.push(readFile('Datos/PM25/1_pumabus.csv', 'PM25pumabus1'));
	promArr.push(readFile('Datos/PM25/2_pumabus.csv', 'PM25pumabus2'));
	promArr.push(readFile('Datos/PM25/3_pumabus.csv', 'PM25pumabus3'));

	promArr.push(
		new Promise(function (resolve, reject){ 
//			d3.json('Datos/MapsGeoJson/Edificios.json', function(error, data) {
			d3.json('Datos/MapsGeoJson/CU.json', function(error,data) {
					if(error){
						reject(error);
					}else{
						var features = data.features;
						// Iterates over the data and draws the base map
						var baseLayersGrp = svg.append('g').attr('class', 'base-map');
						baseLayersGrp.selectAll('path').data(features)
								.enter().append('path')
								.attr('d', path);
						resolve('Success for Base map');
					}
				});
			})  );

	// Once all the promises have been completed, then we draw the map
	var allFiles = Promise.all(promArr);
	allFiles.then((successMassage) => { 
		console.log(successMassage);
                drawRoute(conf.cont[0],conf.currentTime,conf.journey[conf.currentJourney]);
                addEvents();
                parseData();
                getDataGraph();
	});

}


function mouseoverDep(){
	console.log("mouseoverDep");
}

//intento para mover un punto en el mapa :)
//si se pudo era facil
//logro su objetivo, pero hay que optimizar
function moveToPosition(obj1, obj2) {
        svg.selectAll('#selected-point').remove();
        var baseLayersGrp = svg.append('g').attr('id', 'selected-point');
        var i = 0;
        var j = 0;
        baseLayersGrp.selectAll("circle").data([obj1, obj2])
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
       
$(window).resize(function(){
	var width = $("#map").width();
	var height= window.innerHeight - 2*margin;
	console.log("Risizing map...");
	resizeMap(width, height);
        resizeGraph();
})

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
			.scale(getMapScale(width,height))
			.center(center)
			.translate([width / 2, height / 2]);
	
	// Iterates over the data and draws something
	d3.selectAll('path').attr('d', path);
	d3.selectAll('circle').attr('d', path);

}