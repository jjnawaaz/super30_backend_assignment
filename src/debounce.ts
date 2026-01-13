function debouncer(fn: any, delay: number) {
  let timeout: any;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), delay);
    console.log(timeout);
  };
}

const consoleDebouncer = debouncer(() => {
  console.log("Debouncer called");
}, 2000);

consoleDebouncer();
consoleDebouncer();
consoleDebouncer();
