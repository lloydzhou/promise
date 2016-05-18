;(function(promise){
    promise.http = function(url, method, data){
        var core, Promise = promise.promise, lower = String.prototype.toLowerCase,
          ajax = function(method, uri, args){
            return new Promise(function(resolver, reject){
                var client = new XMLHttpRequest(), a = '?', b = '&', e = encodeURIComponent, playload = '';
                if (typeof args == "object") {
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            playload += b + e(key) + '=' + e(args[key]);
                        }
                    }
                } else playload = args
                if(method != 'POST' && method != 'PUT'){
                    uri += (uri.indexOf(a) > -1 ? b : a) + playload.substr(1)
                    playload = null
                }
                client.onload = function () {
                  if (client.status >= 200 && client.status < 300) {
                      // Performs the function "resolve" when this.status is equal to 2xx
                      resolver(client.response);
                  } else {
                      // Performs the function "reject" when this.status is different than 2xx
                      reject(client.statusText);
                  }
                };
                client.onerror = function () {
                    reject(client.statusText);
                };
                client.open(method, uri);
                client.send(playload);
                return client;
            })
        }
        core = new Promise(['HEAD', 'GET', 'POST', 'PUT', 'DELETE'].reduce(function(o, v){
            o[lower.call(v)] = function(args){ return ajax(v, url, args) }
            return o
            //return Object.defineProperty(o, lower.call(v), {
            //    value: function(args){ return ajax(v, url, args) },
            //})
        }, {}))
        return method ? core[lower.call(method)](data) : core
    }
})(window.promise = window.promise || {})

