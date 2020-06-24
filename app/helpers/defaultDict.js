export default (initial = {}, defaultValue) =>
  new Proxy(initial, {
    get: (target, name) => {
      return name in target ? target[name] : defaultValue;
    },
  });
