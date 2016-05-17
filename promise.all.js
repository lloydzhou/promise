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
        var core, p, ajax = function(method, uri, args, playload){
            return p = promise.promise(function(){
                var client = new XMLHttpRequest(), a = '?', b = '&', e = encodeURIComponent;
                if (args) {
                    for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            playload += b + e(key) + '=' + e(args[key]);
                        }
                    }
                }
                if(!(method === 'POST' || method === 'PUT')){
                    uri += uri.indexOf(a) > -1 ? b : a + (playload || '')
                    playload = null
                }
                client.onload = function () {
                  if (this.status >= 200 && this.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    p.resolve(this.response);
                  } else {
                    // Performs the function "reject" when this.status is different than 2xx
                    p.reject(this.statusText);
                  }
                };
                client.onerror = function () {
                  p.reject(this.statusText);
                };
                client.open(method, uri);
                client.send(playload);
                return client;
            })
        }
        core = {
            get: function(args){return ajax('GET', url, args)},
            post: function(args){return ajax('POST', url, args)},
            put: function(args){return ajax('PUT', url, args)},
            'delete': function(args){return ajax('DELETE', url, args)}
        }
        return method ? core[method.toLowerCase()](data) : core
    }
})(window.promise = window.promise || {})
