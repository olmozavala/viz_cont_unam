/*
 * Variables de configuracion
 * se encuentan en pixeles
 * se crea un objeto conf para evitar
 * usar variables repetidas
 */
var conf = {} 
conf.width = 600;
conf.height = 400;
conf.margin = {top: 50, right: 70, bottom: 50, left: 70};//pixels
conf.statWidth = 200;
conf.statHeight = 200;

//informacion del sistema

conf.jorney = ['caminando', 'bicicleta', 'pumabus']
//la ruta de los archivos
conf.path = 'Datos/';
//las variables de los contaminantes y sus nombres de los archivos
conf.cont = ['CO', 'PM25'];
conf.contNames = ['co', 'pm2_5'];
//elementos html
conf.graphMain = 'graph-main';
conf.graphStat = 'graph-stats';
conf.graph = 'graph';
conf.graphControls = 'graph-controls';

var currentJorney = 0;
var currentTime = 1;
var disable = null;
var selected = null;


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
            disable = this;
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
                toJorney(this, 0);
            }, false);
            this.classList.add('selected');
            selected = this;
        }
        if(i === 1) {
            this.addEventListener('click', function(){
                toJorney(this, 1);
            }, false);
        }
        if(i === 2) {
            this.addEventListener('click', function(){
                toJorney(this, 2);
            }, false);
        }
    });
}

function nextTime(elem) {
    if(currentTime > 2) {
        return;
    }
    disable.classList.remove('disable');
    if((currentTime + 1) > 2) {
        elem.classList.add('disable');
        disable = elem;
    }
    currentTime = currentTime + 1;
    getDataGraph(currentJorney, currentTime);
}

function prevTime(elem) {
    if(currentTime < 2) {
        return;
    }
    disable.classList.remove('disable');
    if((currentTime - 1) < 2) {
        elem.classList.add('disable');
        disable = elem;
    }
    currentTime = currentTime - 1;
    getDataGraph(currentJorney, currentTime);
    
}

function toJorney(elem, to) {
    selected.classList.remove('selected');
    elem.classList.add('selected');
    selected = elem;
    currentJorney = to;
    getDataGraph(currentJorney, currentTime);
}

// funcion para cambiar la grafica
function getDataGraph(jorney, time) {
    //clean
    $('#'+ conf.graphMain)[0].classList.add('blur');
    $('#'+ conf.graph).fadeOut('fast');
    $('#'+ conf.graphStat).fadeOut('fast');
    $('#'+ conf.graph).empty();
    $('#'+ conf.graphStat).empty();
    makeGraph(jorney, time);
}


// funcion principal
function makeGraph(jorney, time) {
    jorney = jorney || currentJorney;
    time = time || currentTime;
    fun = moveToPosition();
    var parseTime = d3.timeParse("%d/%m/%Y %H:%M:%S");
    var parseObject = function(con) {
        return function(obj) {
            obj[con] = Number(obj[con]);
            obj.date = parseTime(obj.date);
            obj.lat = Number(obj.lat);
            obj.lon = Number(obj.lon);
            return obj;
        };
    }
    var data = {};
    for(var i = 0; i < conf.cont.length; i++) {
        console.log(conf.path + conf.cont[i] + '/' + time + '_' + conf.jorney[jorney] + '.csv');
        var file =  new SFile(conf.path + conf.cont[i] + '/' + time + '_' + conf.jorney[jorney] + '.csv');
        data[conf.cont[i]] = file.getCSV(parseObject(conf.contNames[i]));
        if(data[conf.cont[i]] == null) {
            console.log('error data');
            return;
        }
    }
    var graph = new Graph(conf.graph, data[conf.cont[0]], conf.width, conf.height, conf.margin.top, conf.margin.right, conf.margin.bottom, conf.margin.left, 'red-line');
    graph.interpolation = d3.curveBasis;
    graph.setRange('x', 'date', function(data, key){ return data[0][key];}, function(data, key){ return data[data.length - 1][key];});
    graph.setRange('y', 'co');
    graph.setScale('x', d3.scaleTime());
    graph.setDomains('x', function(x){return x});
    graph.setDomains('y', graph.minMaxDomain);
    var graph2 = new Graph('dummy', data[conf.cont[1]], conf.width, conf.height, conf.margin.top, conf.margin.right, conf.margin.bottom, conf.margin.left, 'gray-line');
    graph2.interpolation = d3.curveBasis;
    graph2.setRange('y', 'pm2_5');
    graph2.setScale('x', d3.scaleTime());
    graph2.setDomains('x', function(x){return x});
    graph2.setDomains('y', graph2.minMaxDomain);
    
    
    //stats
    var dateFun = function(d){ return d.getDate().toString() +
        '/' + (d.getMonth() + 1) + 
        '/' + d.getFullYear() +
        ' ' + (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) + 
        ':' + (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
        ':' + d.getSeconds();};
    var statCO = new Stat(conf.graphStat, conf.statWidth, conf.statHeight, data[conf.cont[0]][0], 'stats-' + conf.contNames[0]);
    statCO.setAtt(conf.contNames[0], graph.YRange[1], graph.YRange[0], false, true);
    statCO.setAtt('date', null, null, false, false, dateFun);
    var statPM = new Stat(conf.graphStat, conf.statWidth, conf.statHeight, data[conf.cont[1]][0], 'stats-' + conf.contNames[1]);
    statPM.setAtt(conf.contNames[1], graph.YRange[1], graph.YRange[0], false, true);
    statPM.setAtt('date', null, null, false, false, dateFun);
    statPM.div.style.marginLeft = (conf.width - 2 * conf.statWidth) + 'px';
    var update = function(obj1, obj2) {
        var interval = setInterval(function() {
            clearInterval(interval);
            fun(obj1, obj2);
        }, 10);
        statCO.changeValues(obj1);
        statPM.changeValues(obj2);
    };
                //
    graph.addGraph(graph2, update);
    graph.addYGridLines();
    graph.removeYDomain();
    graph.addLabel('y', 'CO', [['class', 'label-graph'], ['transform', 'translate(-30,-20)']]);
    graph.addLabel('y2', 'PM25', [['class', 'label-second-graph'], ['transform', 'translate(' + (graph.width) + ',-20)']]);
    $('#'+ conf.graph).fadeIn('fast');
    $('#'+ conf.graphStat).fadeIn('fast');
    $('#'+ conf.graphMain)[0].classList.remove('blur');
}