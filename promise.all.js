;(function(promise){
    promise.promise = function(context) {
        var callbacks = [], resolve = 'resolve', reject = 'reject',
        execute = function(type, context, args) {
            try{
                if (callbacks.length
                  && typeof (cb = callbacks.shift()[type]) == "function"
                  && (args = cb.apply(context, args)))
                    execute(resolve, context, [args])
            }catch(e){
                [].unshift.call(args, e)
                execute(reject, context, args)
            }
        };
        if (typeof context == "function")
            context = context();
        context = typeof context == "object" ? context : {};
        [resolve, reject, 'then'].forEach(function(n, i){
            Object.defineProperty(context, n, {
                value: i == 2 ? function(onFulfilled, onRejected) {
                    callbacks.push({resolve : onFulfilled, reject: onRejected});
                    return this;
                } : function() {
                    execute(n, this, arguments);
                },
                enumerable: false,
                writable: false,
                configurable: false
            })
        })
        return context;
    };
    promise.http = function(url, method, data){
        var core, p, Promise = promise.promise, lower = String.prototype.toLowerCase,
          ajax = function(method, uri, args){
            return p = new Promise(function(playload){
                var client = new XMLHttpRequest(), a = '?', b = '&', e = encodeURIComponent;
                if (typeof args == "object") {
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            playload += b + e(key) + '=' + e(args[key]);
                        }
                    }
                } else playload = args
                if(!(method === 'POST' || method === 'PUT')){
                    uri += (uri.indexOf(a) > -1 ? b : a) + (playload || '')
                    playload = null
                }
                client.onload = function () {
                  if (client.status >= 200 && client.status < 300) {
                      // Performs the function "resolve" when this.status is equal to 2xx
                      p.resolve(client.response);
                  } else {
                      // Performs the function "reject" when this.status is different than 2xx
                      p.reject(client.statusText);
                  }
                };
                client.onerror = function () {
                    p.reject(client.statusText);
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

