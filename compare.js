
// https://stackoverflow.com/a/16788517/2191332
export function objectEquals(x, y) {
  'use strict';

  if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
  // not checking object constructor.

  // if they are functions, they should exactly refer to same one (because of closures)
  if (x instanceof Function) { return x === y; }
  // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
  if (x instanceof RegExp) { return x === y; }
  if (x === y || x.valueOf() === y.valueOf()) { return true; }
  if (Array.isArray(x) && x.length !== y.length) { return false; }

  // if they are dates, they must had equal valueOf
  if (x instanceof Date) { return false; }

  // if they are strictly equal, they both need to be object at least
  if (!(x instanceof Object)) { return false; }
  if (!(y instanceof Object)) { return false; }

  // recursive object equality check
  var p = Object.keys(x);
  return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
      p.every(function (i) { return objectEquals(x[i], y[i]); });
}

export function objectContains(x, y) {
  'use strict';

  if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
  // not checking object constructor.

  // if they are functions, they should exactly refer to same one (because of closures)
  if (x instanceof Function) { return x === y; }
  // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
  if (x instanceof RegExp) { return x === y; }
  if (x === y || x.valueOf() === y.valueOf()) { return true; }
  if (Array.isArray(x) && x.length !== y.length) { return false; }

  // if they are dates, they must had equal valueOf
  if (x instanceof Date) { return false; }

  // if they are strictly equal, they both need to be object at least
  if (!(x instanceof Object)) { return false; }
  if (!(y instanceof Object)) { return false; }

  // recursive object containment check
  var xKeys = Object.keys(x);
  var yKeys = Object.keys(y);
  return (
    yKeys.every(function (i) { return xKeys.indexOf(i) !== -1; }) &&
    yKeys.every(function (i) { return objectContains(x[i], y[i]); }));

}
