// polyfills.js
if (!Object.hasOwn) {
    Object.defineProperty(Object, 'hasOwn', {
        value: function (obj, prop) {
            return Object.prototype.hasOwnProperty.call(obj, prop);
        },
        writable: true,
        configurable: true,
    });
}
