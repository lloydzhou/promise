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
                execute(reject, context, [e])
            }
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
        if (typeof context == "function")
            context = context.apply(context, properties);
        return [resolve, reject, 'then'].reduce(function(o, n, i){
            return Object.defineProperty(o, n, {
                value: properties[i],
                enumerable: false,
                writable: false,
                configurable: false
            })
        }, typeof context == "object" ? context : {})
    };
})(window.promise = window.promise || {})

