/*
 * Clase para leer archivos de internet
 */
class Stat {

    /*
     * Constructor de la clase
     */
    constructor(target, width, height, obj, clas, max, min, percent) {
        this.div = document.getElementById(clas);
        this.list = document.createElement('ul');
        this.div.appendChild(this.list);
        this.percent = percent || false;//default percent
        this.maxValue = max || 100;
        this.fac = 100 / this.maxValue;
        this.minValue = min || 0;
        this.labels = {};
        this.addLabels(obj);//set default values
    }

    /*
     * agrega etiquetas
     */
    addLabels(obj) {
        for(var key in obj) {
            this.labels[key] = {
                max: this.maxValue,
                min: this.minValue,
                value: document.createElement('span'),
                rec: document.createElement('div'),
                percent: this.percent,
                changeRec: false,
                fun: function(x) { return x; }};
            var item = document.createElement('li');
            var name = document.createElement('span');
            name.className = 'stat-name';
            name.textContent = key;
            this.labels[key].rec.className = 'stat-rec';
            this.labels[key].rec.style.width = '0';
            this.labels[key].rec.style.display = 'none';
            this.labels[key].value.className = 'stat-value';
            item.appendChild(name);
            item.appendChild(this.labels[key].rec);
            item.appendChild(this.labels[key].value);
            this.list.appendChild(item);
            //this.changeValue(key, obj[key]);
        }
    }

    /*
     * cambia el valor
     */
    changeValue(label, value) {
        var fac = value * this.fac;
        var percent = this.labels[label].percent ? '  ' + ((value * 100) / this.labels[label].max) + ' %' : '';
        this.labels[label].value.textContent = this.labels[label].fun(value) + percent;
        if(this.labels[label].changeRec) {
            fac = fac < 0 ? 0 : fac; 
            this.labels[label].rec.style.width = fac + 'px';
            this.labels[label].rec.style.display = 'inline-block';
        }
    }

    /*
     * cambia todos los valores que coincidan con el objeto
     */
    changeValues(obj) {
        for(var key in obj) {
            if(this.labels[key]) {
                this.changeValue(key, obj[key])
            }
        }
    }

    /*
     * asigna propiedades a la etiqueta
     */
    setAtt(label, max, min, percent, changeRec, fun) {
        if(this.labels[label]) {
            this.labels[label].max = max || this.labels[label].max;
            this.labels[label].min = min || this.labels[label].min;
            this.labels[label].percent = percent || this.labels[label].percent;
            this.labels[label].changeRec = changeRec || this.labels[label].changeRec;
            this.labels[label].fun = fun || this.labels[label].fun;
        }
    }

}