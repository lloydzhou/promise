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
        if (typeof context == fun)
            context = context.apply(context, properties);
        return [resolve, reject, 'then'].reduce(function(o, n, i){
            return Object.defineProperty(o, n, {
                value: properties[i],
                enumerable: false,
                writable: false,
                configurable: false
            })
        }, context = typeof context == "object" ? context : {v: context})
    };
})(window.promise = window.promise || {})

