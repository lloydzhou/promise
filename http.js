;(function(promise){
    promise.http = function(url, method, data, header){
        var Promise = promise.promise,
          map = function(args, cb, cb2){
            if (typeof args == "object") {
                for (var key in args) {
                    if (args.hasOwnProperty(key))
                        cb(key, args[key])
                }
            }else cb2 && cb2()
          },
          ajax = function(method, uri, args, header){
            return new Promise(function(resolver, reject){
                var client = new XMLHttpRequest(), a = '?', b = '&'
                  , e = encodeURIComponent, playload = ''
                  , c = 'Content-Type', cv = 'application/x-www-form-urlencoded';
                map(args, function(k, v){
                    playload += b + e(k) + '=' + e(v)
                }, function(){ playload = args })
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
                header = header || {}
                header[c] = header[c] || cv
                map(header, function(k, v){
                    client.setRequestHeader(k, v)
                })
                client.send(playload);
                return client;
            })
        },
        core = new Promise(['HEAD', 'GET', 'POST', 'PUT', 'DELETE'].reduce(function(o, v){
            o[v.toLowerCase()] = function(args, header){ return ajax(v, url, args, header) }
            return o
        }, {}))
        return method ? core[method.toLowerCase()](data, header) : core
    }
})(window.promise = window.promise || {})

