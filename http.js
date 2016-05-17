;(function(promise){
    promise.http = function(url){
        var p, ajax = function(method, uri, args, playload){
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
        return {
            get: function(args){return ajax('GET', url, args)},
            post: function(args){return ajax('POST', url, args)},
            put: function(args){return ajax('PUT', url, args)},
            'delete': function(args){return ajax('DELETE', url, args)}
        }
    }
})(window.promise = window.promise || {})

