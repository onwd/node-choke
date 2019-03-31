'use strict';

const { createHook } = require('async_hooks');

const resources = new Map();

module.exports = (callback, options = {}) => {
  Error.stackTraceLimit = Infinity;

  const threshold = (options.threshold || 20) * 1e6;
  const hook = createHook({ init, before, after, destroy });

  function init(id, type) {
    resources.set(id, {
      type,
      stack: new Error().stack
    });
  }

  function before(id) {
    const resource = resources.get(id);

    if (resource) {
      resource.start = timeNs();
    }
  }

  function after(id) {
    const resource = resources.get(id);

    if (resource) {
      const end = timeNs();
      const dt = end - resource.start;
  
      if (dt > threshold) {
        setImmediate(callback, {
          type: resource.type,
          stack: resource.stack,
          start: resource.start,
          end,
          dt
        });
      }
    }
  }

  function destroy(id) {
    resources.delete(id);
  }

  function timeNs() {
    const time = process.hrtime();
    return time[0] * 1e9 + time[1];
  }

  hook.enable();

  return hook;
};
