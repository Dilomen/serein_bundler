function throttle(fn, delay) {
  let timer;
  return function() {
    let last = timer;
    let now = Date.now();
    if (!last) {
      timer = now;
      fn.apply(this, arguments);
      return;
    }
    if (now - last < delay) return;
    timer = now;
    fn.apply(this, arguments);
  };
}

module.exports = throttle