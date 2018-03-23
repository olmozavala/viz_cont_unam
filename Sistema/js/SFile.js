/*
 * Clase para leer archivos de internet
 */

class SFile {

    /*
     * Constructor de la clase
     */
    constructor(url, method, async, uname, pswd) {
        this.url = url;
        this.method = method === 'GET' || method === 'POST' ? method : 'GET';
        this.async = async || false;
        this.uname = uname;
        this.pswd = pswd;
        this.file = new XMLHttpRequest();
        this.response = null;
    }

    /* .header("Content-Type", "application/x-www-form-urlencoded")
     * cambia la url
     */
    setUrl(url) {
       this.url = url;
    }

    /*
     * cambia el metodo
     */
    setMethod(method) {
       this.method = method === 'GET' || method === 'POST' ? method : 'GET';
    }

    /*
     * cambia si debe ser sincrono o asincrono
     */
    setAsync(async) {
        this.async = async || false;
    }

    /*
     * cambia el nombre del usuario
     */
    setName(uname) {
        this.uname = uname;
    }

    /*
     * cambia la contraseña
     */
    setPswd(pswd) {
        this.pswd = pswd;
    }

    /*
     * funcion para obtener la informacion
     */
    getData(fun, send, type) {
        try {
            type = type === 'xml'? 'responseXML' : 'responseText';
            this.file.open(this.method, this.url, this.async, this.uname, this.pswd);
            var file = this;
            this.file.onreadystatechange = function() {
                if(file.file.readyState === 4 &&  file.file.status === 200) {
                    if(typeof fun === 'function') {
                        file.response = fun(file.file[type]);
                    } else {
                        file.response = file.file[type];
                    }
                }
            }
            this.file.send(send);
            return this.response;
        }catch(error) {
            console.log(error);
            return null;
        }
    }

    /*
     * obtine una lista de objetos javascript
     * con cabeceras
     */
    getCSV(format, fun) {
        var format = typeof format === 'function' ? format : function(x){ return x;};
        var parse = function txtToJSO(file) {
            var json = [];
            var data = file.split(/\r\n|\r|\n/g);
            if(data[data.length - 1] === "") {
                data.pop();
            }
            var headers = data[0].split(",");//las cabeceras
            for(var i = 1; i < data.length; i++) {
                var elem = data[i].split(",");
                var obj = {};
                for(var j = 0; j < elem.length; j++) {
                    obj[headers[j]] = elem[j];
                }
                json.push(format(obj));
            }
            return json;
        }
        return this.getData(parse, fun);
    }
}