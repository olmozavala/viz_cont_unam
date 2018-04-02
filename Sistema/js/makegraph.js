//variable con la informacion
var data = {};
var statCO = null;
var statPM = null;
/*
 * Variables de configuracion
 * se encuentan en pixeles
 * se crea un objeto conf para evitar
 * usar variables repetidas
 */
var conf = {}; 
conf.width = $("#graph-main").width();
conf.height = window.innerHeight*.4;// Always 30% of height
// THIS MARGIN SHOULD CHANGE DEPENDING ON THE SIZE OF THE GRAPH
conf.margin = {top: 30, right: 40, bottom: 40, left: 40};//pixels
conf.statWidth = $("#graph-main").width();
conf.statHeight = window.innerHeight*.4;// Always 30% of height
conf.maxJourneyControl = 600;

//informacion del sistema
conf.journey = ['caminando', 'bicicleta', 'pumabus']
//las variables de los contaminantes y sus nombres de los archivos
conf.cont = ['CO', 'PM25'];
conf.contNames = ['co', 'pm2_5'];
//elementos html
conf.graphMain = 'graph-main';
conf.graphStat = 'graph-stats';
conf.graph = 'graph';
conf.graphControls = 'graph-controls';
conf.journeyControl = 'journey';


if(conf.width < conf.maxJourneyControl) {
    $('#' + conf.journeyControl + ' ul').width(conf.width);
} else {
    $('#' + conf.journeyControl + ' ul').width(conf.maxJourneyControl);
}

//para cambiar el mapa
conf.currentJourney = 0;
conf.currentTime = 1;
conf.disable = null;
conf.selected = null;


//funciones
conf.parseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");
conf.parseObject = function(con) {
        return function(obj) {
            obj[con] = Number(obj[con]);
            obj.date = conf.parseTime(obj.date);
            obj.lat = Number(obj.lat);
            obj.lon = Number(obj.lon);
            return obj;
        };
    };

conf.updateStat = function(obj1, obj2) {
        var interval = setInterval(function() {
            clearInterval(interval);
            moveToPosition(obj1, obj2);
        }, 10);
        statCO.changeValues(obj1);
        statPM.changeValues(obj2);
    };

conf.statDateFun = function(d){ return d.getDate().toString() +
        '/' + (d.getMonth() + 1) + 
        '/' + d.getFullYear() +
        ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + 
        ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
        ':' + (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds());
    };

//eventFun funcion principal
function addEvents() {
    var controls = $('#' + conf.graphControls);
    var find = $('i');
    $('#' + conf.graphControls).find($('i')).each(function(i) {
        if(i === 0) {
            this.addEventListener('click', function(){
                prevTime(this);
            }, false);
            this.classList.add('disable');
            conf.disable = this;
        } else {
            this.addEventListener('click', function(){
                nextTime(this);
            }, false);
        }
    });
    var find = $('li');
    controls.find(find).each(function(i) {
        if(i === 0) {
            this.addEventListener('click', function(){
                toJourney(this, 0);
            }, false);
            this.classList.add('selected');
            conf.selected = this;
        }
        if(i === 1) {
            this.addEventListener('click', function(){
                toJourney(this, 1);
            }, false);
        }
        if(i === 2) {
            this.addEventListener('click', function(){
                toJourney(this, 2);
            }, false);
        }
    });
}

function resizeGraph() {
    conf.width =  $('#' + conf.graphMain).width();
    conf.height = window.innerHeight*.4;
    conf.statWidth = $('#' + conf.graphMain).width();
    conf.statHeight = window.innerHeight*.4;
    var interval = setInterval(function() {
        clearInterval(interval);
        drawRoute(conf.cont[0],conf.currentTime,conf.journey[conf.currentJourney]);
    }, 10);
    var interval1 = setInterval(function() {
        clearInterval(interval1);
        getDataGraph();
    }, 500);
   if(conf.width < conf.maxJourneyControl) {
       $('#' + conf.journeyControl + ' ul').width(conf.width);
   } else {
       $('#' + conf.journeyControl + ' ul').width(conf.maxJourneyControl);
   }
}


function nextTime(elem) {
    if(conf.currentTime > 2) {
        return;
    }
//    $('#'+ conf.graphMain).addClass('blur');
    conf.disable.classList.remove('disable');
    if((conf.currentTime + 1) > 2) {
        elem.classList.add('disable');
        conf.disable = elem;
    }
    conf.currentTime = conf.currentTime + 1;
    getDataGraph();
}

function prevTime(elem) {
    if(conf.currentTime < 2) {
        return;
    }
//    $('#'+ conf.graphMain).addClass('blur');
    conf.disable.classList.remove('disable');
    if((conf.currentTime - 1) < 2) {
        elem.classList.add('disable');
        conf.disable = elem;
    }
    conf.currentTime = conf.currentTime - 1;
    getDataGraph();
    
}

function toJourney(elem, to) {
//    $('#'+ conf.graphMain).addClass('blur');
    conf.selected.classList.remove('selected');
    elem.classList.add('selected');
    conf.selected = elem;
    conf.currentJourney = to;
    getDataGraph();
    var interval = setInterval(function() {
        clearInterval(interval);
        drawRoute(conf.cont[0],conf.currentTime,conf.journey[conf.currentJourney]);
    }, 10);
}

function parseData() {
    for(var time = 1; time <= 3; time++) {
        for(var journey in conf.journey) {
            for(var cont in conf.cont) {
                var id = conf.cont[cont]+conf.journey[journey]+time;
                data[id] = dataGeo[id].map(function(obj) { return conf.parseObject(conf.contNames[cont])(obj);});
            }
        }
    }
}

// funcion para cambiar la grafica
function getDataGraph() {
    //clean
    $('#'+ conf.graph).empty();
    var interval = setInterval(function() {
            clearInterval(interval);
            makeGraph();
    }, 200);
}

function makeStats(graph) {
    var id1 = conf.cont[0]+conf.journey[conf.currentJourney]+conf.currentTime;
    var id2 = conf.cont[1]+conf.journey[conf.currentJourney]+conf.currentTime;
    
    statCO = new Stat(conf.graphStat, conf.statWidth, conf.statHeight, data[id1][0], 'stats-' + conf.contNames[0]);
    statCO.setAtt(conf.contNames[0], graph.YRange[1], graph.YRange[0], false, true);
    statCO.setAtt('date', null, null, false, false, conf.statDateFun);
    
    statPM = new Stat(conf.graphStat, conf.statWidth, conf.statHeight, data[id2][0], 'stats-' + conf.contNames[1]);
    statPM.setAtt(conf.contNames[1], graph.YRange[1], graph.YRange[0], false, true);
    statPM.setAtt('date', null, null, false, false, conf.statDateFun);
}

// funcion principal
function makeGraph() {
    
    var id1 = conf.cont[0]+conf.journey[conf.currentJourney]+conf.currentTime;
    var id2 = conf.cont[1]+conf.journey[conf.currentJourney]+conf.currentTime;
    
    
    var graph = new Graph(conf.graph, data[id1], conf.width, conf.height, conf.margin.top, conf.margin.right, conf.margin.bottom, conf.margin.left, 'red-line');
    graph.interpolation = d3.curveBasis;
    graph.setRange('x', 'date', function(data, key){ return data[0][key];}, function(data, key){ return data[data.length - 1][key];});
    graph.setRange('y', 'co');
    graph.setScale('x', d3.scaleTime());
    graph.setDomains('x', function(x){return x});
    graph.setDomains('y', graph.minMaxDomain);
    var graph2 = new Graph('dummy', data[id2], conf.width, conf.height, conf.margin.top, conf.margin.right, conf.margin.bottom, conf.margin.left, 'gray-line');
    graph2.interpolation = d3.curveBasis;
    graph2.setRange('y', 'pm2_5'); // Sets the values for pm25 graph
    graph2.setScale('x', d3.scaleTime());
    graph2.setDomains('x', function(x){return x});
    graph2.setDomains('y', graph2.minMaxDomain);
    
    if(!statCO || !statPM) {
        makeStats(graph);
    }
    
    graph.addGraph(graph2, conf.updateStat, null, null, 'PM2_5');
    graph.addYGridLines();
    graph.removeYDomain();
    $('#'+ conf.graphMain).removeClass('blur');
}