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
        return [resolve, reject, 'then'].reduce(function(o, n, i){
            return Object.defineProperty(o, n, {
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
        }, typeof context == "object" ? context : {})
    };
})(window.promise = window.promise || {})

