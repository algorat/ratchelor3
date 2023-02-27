//Thanks to https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
export function uniqueBy(a, key) {
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return Object.hasOwn(seen, k) ? false : (seen[k] = true);
  });
}
