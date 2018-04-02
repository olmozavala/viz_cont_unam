/*
 * Clase para leer archivos de internet
 */

class Graph {

    /*
     * Constructor de la clase
     */
    constructor(target, data, width, height, top, right, bottom, left, pclass) {
        pclass = pclass || '';
        this.target = d3.select('#'+target);
        this.setSize(width, height, top, right, bottom, left);
        this.data = data;
        this.dataScale = data.length / width;
        this.pclass = 'line ' + pclass;
        this.XKey = null;
        this.YKey = null;
        this.XRange = null;
        this.YRange = null;
        this.XAxis = null;
        this.YAxis = null;
        this.rect = null;
        this.focus = [];//array
        this.defaultScalefun();
        this.defaultMinFun();
        this.defaultMaxFun();
        this.defaultDomainFun();
        this.defaultMinMaxFun();
        this.defaultCurveFun();
        this.defaultMouseOverFun();
        this.defaultInterFun();
    }

    /*
     * default functions
     */
    defaultScalefun() {
        this.scale = d3.scaleLinear();
    }

    /*
     * default functions
     */
    defaultMinFun() {
        this.min = function(data, key) {
            return d3.min(data.map(function(obj) { return obj[key]; }));
        }
    }

    /*
     * default functions
     */
    defaultMaxFun() {
        this.max = function(data, key) {
            return d3.max(data.map(function(obj) { return obj[key]; }));
        }
    }

    /*
     * default functions
     */
    defaultDomainFun() {
        this.domain = function(range) {
            return [0, d3.max(range)];
        }
    }

    /*
     * default functions
     */
    defaultMinMaxFun() {
        this.minMaxDomain = function(range) {
            return [d3.min(range), d3.max(range)];
        }
    }

    /*
     * default functions
     */
    defaultCurveFun() {
        this.curve = d3.line();
    }

    /*
     * default functions
     */
    defaultInterFun() {
        this.interpolation = d3.curveLinear;
    }

    /*
     * default functions
     */
    defaultMouseOverFun() {
        this.moFun = function(obj, pos) {
            return function() {
                var x = d3.mouse(this)[0];
                var inv = obj.XScale.invert(x);
                var bisect = d3.bisector(function(d) { return d.date; }).left;
                var idx = bisect(obj.data, inv);
                var elem = obj.data[idx];
                var X = obj.XScale(elem[obj.XKey]);
                var y = obj.YScale(elem[obj.YKey]);
                obj.focus[pos].attr('transform', 'translate(' + (obj.margin.left + x) + ',' + (obj.margin.top + y) + ')');
                obj.focus[pos].select('text').text(elem[obj.YKey]);
                obj.focus[pos].select('path').attr('transform', 'translate(0,' + (-y - obj.margin.top) + ')');
            }
        }
    }


    /*
     * custom 2 graphs functions
     */
    twoMouseOverFun() {
        return function(obj) {
            return function() {
                for(var elem in obj.focus) {
                    obj.focus[elem].style('display', null);
                }
            }
        }
    }

    /*
     * custom 2 graphs functions
     */

     twoMouseOutFun() {
         return function(obj) {
            return function() {
                for(var elem in obj.focus) {
                    obj.focus[elem].style('display', 'none');
                }
            }
        }
     }

    /*
     * custom 2 graphs functions
     */
     twoMouseMoveFun() {
         return function(graph1, graph2, fun) {
             fun = fun || function(a,b){};
             var bisect = d3.bisector(function(d) { return d.date; }).left;
             return function() {
                var x = d3.mouse(this)[0];
                var inv = graph1.XScale.invert(x);//important
                var i = bisect(graph1.data, inv);//important
                var obj1 = graph1.data[i];
                var obj2 = graph2.data[i];
                var y1 = graph1.YScale(obj1[graph1.YKey]);
                var y2 = graph2.YScale(obj2[graph2.YKey]);
                graph1.focus[0].attr('transform', 'translate(' + (graph1.margin.left + x) + ',' + (graph1.margin.top + y1) + ')');
                graph1.focus[0].select('text').text(obj1[graph1.YKey]);
                graph1.focus[0].select('path').attr('transform', 'translate(0 ,' + (-y1 - graph1.margin.top) + ')');
                graph1.focus[1].attr('transform', 'translate(' + (graph1.margin.left + x) + ',' + (graph1.margin.top + y2) + ')');
                graph1.focus[1].select('text').text(obj2[graph2.YKey]);
                fun(obj1, obj2);
            }
         }
     }

    
    /*
     * cambia la informacion
     */
    setData(data) {
       this.data = data;
    }

    /*
     * cambia el objetivo
     */
    setTarget(target) {
       this.target = d3.select('#'+target);
    }

    /*
     * Asigna el  tamaño
     */
    setSize(width, height, top, right, bottom, left) {
        top = top || 0;
        right = right || 0;
        bottom = bottom || 0;
        left = left || 0;
        this.target.attr('width', width)
        .attr('height', height)
        this.width = width - left - right;
        this.height = height - top - bottom;
        this.margin = {top: top, right: right, bottom: bottom, left: left};
        this.XScaleRange = [0, this.width];
        this.YScaleRange = [this.height, 0];
    }

    /*
     * cambia el rango del eje x
     */
    setRange(axis, key, funMin, funMax) {
        axis = axis || 'x';//default put a x range
        var i = axis === 'x' ? 0 : 1;
        key = key || Object.keys(this.data[0])[i];//default first element
        this[axis.toUpperCase() + 'Key'] = key;
        this[axis.toUpperCase() + 'Range'] = this.getDataRange(key, funMin, funMax);
    }

    /*
     * obtiene el rango 
     */
    getDataRange(key, funMin, funMax) {
        funMin = funMin || this.min;
        funMax = funMax || this.max;
        return [funMin(this.data, key), funMax(this.data, key)];
    }

    /*
     * asigna los ejes
     */
    setScale(axis, scale, range) {
        axis = axis || 'x';
        scale = scale || this.scale;
        range = range || this[axis.toUpperCase() + 'ScaleRange'];
        if(this[axis.toUpperCase() + 'Range'] == null) {
            this.setRange(axis);
        }
        this[axis.toUpperCase() + 'Scale'] = scale.range(range);
    }

    
    /*
     * asigna los dominios
     */
    setDomains(axis, domain, range) {
        axis = axis || 'x';
        domain = domain || this.domain;
        if(this[axis.toUpperCase() + 'Scale'] == null) {
            this.setScale(axis);
        }
        range = range || this[axis.toUpperCase() + 'Range'];
        this[axis.toUpperCase() + 'Scale'].domain(domain(range));
    }

    /*
     * asigna los ejes
     */
    setAxis() {
        if(this.XScale == null) {
            this.setDomains('x');
        }
        if(this.YScale == null) {
            this.setDomains('y');
        }
        this.XAxis = d3.axisBottom(this.XScale);
        this.YAxis = d3.axisLeft(this.YScale);
    }

   /*
    * se asigna el valor de la funcion
    */
    setPath(type) {
        type = type || this.curve;
        var obj = this;
        this.path = type
        .x(function(v) { return obj.XScale(v[obj.XKey]); })
        .y(function(v) { return obj.YScale(v[obj.YKey]); })
        .curve(this.interpolation);
    }

    /*
     * Agrega el eje X
     */
    addXAxis(clas) {
        clas = clas || 'xaxis'
        if(this.XAxis == null) {
            this.setAxis();
        }
        this.GXAxis = this.target.append('g')
            .attr('class', clas)
            .attr('transform', 'translate(' + this.margin.left + ', ' + (this.height + this.margin.top) + ')')
            .call(this.XAxis)
    }

    /*
     * Agrega el eje Y
     */
    addYAxis(clas) {
        clas = clas || 'yaxis';
        if(this.YAxis == null) {
            this.setAxis();
        }
        this.GYAxis = this.target.append('g')
            .attr('class', clas)
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .call(this.YAxis);
    }

    
    /*
     * Agrega lineas al eje X
     */
    addXGridLines(num, clas) {
        num = num || 5;
        clas = clas || 'xgrid';
        var obj = this;
        var gridFun = function() {
                        return d3.axisBottom(obj.XScale)
                        .ticks(num);
        }
        this.XGrid = this.target.append('g')
                    .attr('class', clas)
                    .attr('transform', 'translate('+ this.margin.left + ',' + (this.height + this.margin.top) + ')')
                    .call(gridFun()
                        .tickSize(-obj.height)
                        .tickFormat(''));
    }

    
   /*
    * Agrega lineas al eje Y
    */
    addYGridLines(num, clas) {
        num = num || 5;
        clas = clas || 'ygrid';
        var obj = this;
        var gridFun = function() {
                        return d3.axisLeft(obj.YScale)
                        .ticks(num);
        }
        this.YGrid = this.target.append('g')
                    .attr('class', clas)
                    .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
                    .call(gridFun()
                        .tickSize(-obj.width)
                        .tickFormat(''));
    }

    /*
     * add a line
     */
    addLine() {
        this.line = this.target.append('g')
            .attr('class', 'mouse-line')
            .style('stroke', 'black')
            .style('stroke-width', '1px');
    }

    /*
     * add label
     */
    addLabel(axis, label, list) {
        this[axis.toUpperCase() +  'Label'] = this.target.append('text').text(label);
        for(var key in list) {
             this[axis.toUpperCase() +  'Label'].attr(list[key][0],list[key][1]);
         }
    }
    
    
    /*
     * Agrega un elemento para saber la posicion
     * actual en la grafica
     */
    addFocus() {
        var focus = this.target.append('g')
                    .attr('class', 'focus')
                    .style('display', 'none');
        this.focus.push(focus);
    }
   
   /*
    * Agrega un elemento especial en la grafica
    */
    addFocusElement(type, list, nFocus) {
         if(this.focus.length === 0) {
             this.addFocus();
         }
         nFocus = nFocus || 0;
         type = type || 'circle';
         list = list || [];
         var elem = this.focus[nFocus].append(type); 
         for(var key in list) {
             elem.attr(list[key][0],list[key][1]);
         }
    }

    /*
     * Agrega el rectangulo que genera los eventos del mouse
     */
    addRec(mOver, mOut, mMove, pos) {
        var graph = this;
        var pos = this.focus.length - 1;
        mOver = mOver || function(obj, pos) {return function() {obj.focus[pos].style('display', null);}};// this.line.style('display', null);}; }
        mOut = mOut || function(obj, pos) {return function() {obj.focus[pos].style('display', 'none');}};// this.line.style('display', 'none');}; }
        mMove = mMove || this.moFun;
        this.rect = this.target.append('rect')
        .attr('class', 'overlay')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
        .on('mouseover', mOver(graph, pos))
        .on('mouseout', mOut(graph, pos))
        .on('mousemove', mMove(graph, pos));
    }

    /*
     * Custom rec para 2 graficas
     */
    addRecGraph(graph, fun) {
        var mOver = this.twoMouseOverFun();
        var mOut = this.twoMouseOutFun();
        var mMove = this.twoMouseMoveFun();
        this.rect = this.target.append('rect')
        .attr('class', 'overlay')
        .attr('width', this.width)
        .attr('height', this.height)
        .attr('transform', 'translate(' + this.margin.left + ', ' + this.margin.top + ')')
        .on('mouseover', mOver(this))
        .on('mouseout', mOut(this))
        .on('mousemove', mMove(this, graph, fun));
    }

    /*
     * remove domain
     */
    removeXDomain() {
        this.target.select('.domain').remove();
    }

    /*
     * remove domain
     */
    removeYDomain() {
        this.target.selectAll('.domain')._groups.forEach(function(dom) {
            for(var i = 0; i < dom.length; i++) {
                if(i > 0) {
                    dom[i].remove();
                }
            }
        });
    }

    /*
     * prepare a graph
     */
    preGraph() {
        // se agrega el eje x
        this.addXAxis();
        // se agrega el eje y
        this.addYAxis();
        //se agrega la linea
         this.setPath();
    }

    /*
     * paint the graph
     */
    strokeGraph() {
        this.mainPath = this.target.append('path')
            .data([this.data])
            .attr('class', this.pclass)
            .attr('d', this.path)
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    }

    /*
     * add focus elements
     */
    addfocusElements() {
        this.addFocusElement('circle', [['r', 4.5], ['class', 'point-graph']]);
        this.addFocusElement('text', [['x', 12], ['dy', '.35em'], ['class', 'focus-text']]);
        this.addFocusElement('path', [['stroke', 'black'], ['stroke-width', '1px'], ['d', 'M 0 ' + (this.height + this.margin.top) + ' L 0 ' + this.margin.top]]);
    }

    /*
     * Crea la grafica
     */
    linearGraph() {
        this.preGraph();
        this.strokeGraph();
    }

    /*
     * Agrega otra grafica
     */
    addGraph(graph, fun, labelX, labelY1, labelY2) {
        if(this.mainPath == null) {
            this.preGraph();
        }
        if(graph.mainPath == null) {
            graph.preGraph();
        }
        this.strokeGraph();
        graph.mainPath = this.target.append('path')
                .data([graph.data])
                .attr('class', graph.pclass)
                .attr('d', graph.path)
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        graph.GYAxis = this.target.append('g')
                .attr('class', 'y-second-graph')
                .attr('transform', 'translate(' + (this.width + this.margin.left) + ', ' + this.margin.top + ')')
                .call(d3.axisRight(graph.YScale));
        //focus para la primera grafica
        this.addFocus();
        this.addfocusElements();
        //focus para la segunda
        this.addFocus();
        this.addFocusElement('circle', [['r', 4.5], ['class', 'point-second-graph']], 1);
        this.addFocusElement('text', [['x', 12], ['dy', '.35em'], ['class', 'focus-second-text']], 1);
        //add rect
        this.addRecGraph(graph, fun);
        //add labels
        this.addLabel('x', labelX || this.XKey.toUpperCase(), [['class', 'xlabel-graph'], ['transform', 'translate(' + (this.width * 0.5 + this.margin.left) + ', ' + (this.margin.top + this.height + this.margin.bottom * 0.9) + ')']]);
        this.addLabel('y', labelY1 || this.YKey.toUpperCase(), [['class', 'ylabel-graph'], ['transform', 'translate(' + (this.margin.left * 0.5) + ', ' + (this.margin.top * 0.5) + ')']]);
        this.addLabel('y2', labelY2, [['class', 'ylabel-second-graph'], ['transform', 'translate(' + (this.width + this.margin.left - 5) + ', ' + (this.margin.top * 0.5) + ')']]);
    }
}