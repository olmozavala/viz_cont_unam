var fileName = "data/world.json";
//var fileName = "data/californiaCounties.json";
//var fileName = "data/counties.json";

var zoom = d3.geo.zoom().projection(projection)
//            .scaleExtent([projection.scale() * .7, projection.scale() * 10])
		.on("zoom.redraw", function() {
			//			d3.event.sourceEvent.preventDefault();
	svg.selectAll("path").attr("d", path);
});

//jquery init function
function renderMap(){
	
	//Adds the graticule
	map.append("path")
			.datum(graticule)
			.attr("d", path)
			.classed("grid",true);

	var renderWorld = new Promise(function(resolve, reject) {
		d3.json(fileName, function(err, data) {
			if (err){
				reject(Error("Not able to render the world"));
			}else{
				world = topojson.feature(data, data.objects.land);
				map.append("path")
						.datum(world)
						.attr("d",path)
						.classed("land",true);
				
				resolve("Countries loaded correctly");
			}
		});
	});
	
	renderWorld.then(function(result) {
		d3.json("data/californiaCounties.json", function(err, data) {
			if (err){
				dispError("Not able to display counties");
			}else{
				var countiesJson = topojson.feature(data, data.objects.counties);
/*
				counties = map.selectAll("path").data(countiesJson.features);

				counties.enter()
						.append("path")
						.attr("d", path)
						.classed("blue",true);

//				counties.exit().remove();
						*/

				map.append("path")
						.datum(countiesJson)
						.attr("d",path)
						.classed("blue",true);
	
				
				d3.selectAll("g").call(zoom);
			}
		});
	}, function(err) {
		dispError(err);
	});
	
	
}