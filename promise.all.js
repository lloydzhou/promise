;(function(promise){
    promise.promise = function(context) {
        var callbacks = [], resolve = 'resolve', reject = 'reject', fun = "function",
        execute = function(type, context, args) {
            if (callbacks.length
              && typeof (cb = callbacks.shift()[type]) == fun
              && (args = cb.apply(context, args)))
                execute(resolve, context, [args])
        }, properties = [
            function(){
                execute(resolve, context, arguments);
            }, function(){
                execute(reject, context, arguments);
            }, function(onFulfilled, onRejected){
                callbacks.push({resolve : onFulfilled, reject: onRejected});
                return context;
            }
        ];
        if (typeof (context = context || {}) == fun)
            context.__v = context.apply(context, properties);
        return [resolve, reject, 'then'].reduce(function(o, n, i){
            return Object.defineProperty(o, n, {
                value: properties[i],
                enumerable: false,
                writable: false,
                configurable: false
            })
        }, context)
    };
    promise.http = function(url, method, data){
        var Promise = promise.promise,
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
        },
        core = new Promise(['HEAD', 'GET', 'POST', 'PUT', 'DELETE'].reduce(function(o, v){
            o[v.toLowerCase()] = function(args){ return ajax(v, url, args) }
            return o
        }, {}))
        return method ? core[method.toLowerCase()](data) : core
    }
})(window.promise = window.promise || {})

