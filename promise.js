;(function(promise){
    promise.promise = function(context) {
        var callbacks = [], execute = function(type, context, args) {
            try{
                if (callbacks.length && (args = callbacks.shift()[type].apply(context, args)))
                    execute('resolve', context, [args])
            }catch(e){
                [].unshift.call(args, e)
                execute('reject', context, args)
            }
        };
        context = context || {};
        ['resolve', 'reject', 'then'].forEach(function(n, i){
            Object.defineProperty(context, n, {
                value: i == 2 ? function(onFulfilled, onRejected) {
                    callbacks.push({'resolve' : onFulfilled, 'reject': onRejected});
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
})(window.promise = window.promise || {})

