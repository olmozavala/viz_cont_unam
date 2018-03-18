(function(){

  var height = 600;
  var width = 900;
  var projection = d3.geo.mercator();
  var mexico = void 0;
  var db = d3.map();
  var sparkline = d3.charts.sparkline().height(50).width(138);

  var setDb = function(data) {
    data.forEach(function(d) {
      db.set(d.geoID, [
        {"x": 1, "y": +d.q1},
        {"x": 2, "y": +d.q2},
        {"x": 3, "y": +d.q3},
        {"x": 4, "y": +d.q4}]);
    });
  };

  var geoID = function(d) {
    return "c" + d.properties.ID_1;
  };

  var hover = function(d) {
    var div = document.getElementById('tooltip');
    div.style.left = event.pageX +'px';
    div.style.top = event.pageY + 'px';
    div.innerHTML = d.properties.NAME_1;

    var id = geoID(d);
    d3.select("#tooltip").datum(db.get(id)).call(sparkline.draw);
  };

  var path = d3.geo.path().projection(projection);

  var svg = d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json('geo-data.json', function(data) {
    var states = topojson.feature(data, data.objects.MEX_adm1);

    var b, s, t;
    projection.scale(1).translate([0, 0]);
    var b = path.bounds(states);
    var s = .9 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
    projection.scale(s).translate(t);

    var map = svg.append('g').attr('class', 'boundary');
    mexico = map.selectAll('path').data(states.features);

    mexico.enter()
       .append('path')
       .attr('d', path)
       .on("mouseover", hover);

    mexico.attr('fill', '#eee');

    mexico.exit().remove();

    d3.csv('states-data.csv', function(data) {
      setDb(data);
    });
  });

})();
