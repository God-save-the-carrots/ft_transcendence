let currentObserver = null;

function debounceFrame(callback) {
  let currentCallback = -1;
  return () => {
    cancelAnimationFrame(currentCallback);
    currentCallback = requestAnimationFrame(callback);
  };
}

export async function observe(fn, obj) {
  currentObserver = debounceFrame(fn);
  for (const key in obj) {
    if (Object.hasOwn(obj, key) == false) continue;
    obj[key];
  }
  await fn();
  currentObserver = null;
}

export function observable(obj) {
  const observerMap = Object.keys(obj).reduce((map, key) => {
    map[key] = new Set();
    return map;
  }, {});
  return new Proxy(obj, {
    get: (target, name) => {
      observerMap[name] = observerMap[name] || new Set();
      if (currentObserver) observerMap[name].add(currentObserver);
      return target[name];
    },
    set: (target, name, value) => {
      if (target[name] === value) return true;
      if (JSON.stringify(target[name]) === JSON.stringify(value)) return true;
      target[name] = value;
      observerMap[name].forEach((fn) => fn());
      return true;
    },
  });
}
