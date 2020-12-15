// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/defined/index.js":[function(require,module,exports) {
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],"node_modules/canvas-sketch-util/lib/wrap.js":[function(require,module,exports) {
module.exports = wrap;
function wrap (value, from, to) {
  if (typeof from !== 'number' || typeof to !== 'number') {
    throw new TypeError('Must specify "to" and "from" arguments as numbers');
  }
  // algorithm from http://stackoverflow.com/a/5852628/599884
  if (from > to) {
    var t = from;
    from = to;
    to = t;
  }
  var cycle = to - from;
  if (cycle === 0) {
    return to;
  }
  return value - cycle * Math.floor((value - from) / cycle);
}

},{}],"node_modules/canvas-sketch-util/math.js":[function(require,module,exports) {
var defined = require('defined');
var wrap = require('./lib/wrap');
var EPSILON = Number.EPSILON;

function clamp (value, min, max) {
  return min < max
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value);
}

function clamp01 (v) {
  return clamp(v, 0, 1);
}

function lerp (min, max, t) {
  return min * (1 - t) + max * t;
}

function inverseLerp (min, max, t) {
  if (Math.abs(min - max) < EPSILON) return 0;
  else return (t - min) / (max - min);
}

function smoothstep (min, max, t) {
  var x = clamp(inverseLerp(min, max, t), 0, 1);
  return x * x * (3 - 2 * x);
}

function toFinite (n, defaultValue) {
  defaultValue = defined(defaultValue, 0);
  return typeof n === 'number' && isFinite(n) ? n : defaultValue;
}

function expandVector (dims) {
  if (typeof dims !== 'number') throw new TypeError('Expected dims argument');
  return function (p, defaultValue) {
    defaultValue = defined(defaultValue, 0);
    var scalar;
    if (p == null) {
      // No vector, create a default one
      scalar = defaultValue;
    } else if (typeof p === 'number' && isFinite(p)) {
      // Expand single channel to multiple vector
      scalar = p;
    }

    var out = [];
    var i;
    if (scalar == null) {
      for (i = 0; i < dims; i++) {
        out[i] = toFinite(p[i], defaultValue);
      }
    } else {
      for (i = 0; i < dims; i++) {
        out[i] = scalar;
      }
    }
    return out;
  };
}

function lerpArray (min, max, t, out) {
  out = out || [];
  if (min.length !== max.length) {
    throw new TypeError('min and max array are expected to have the same length');
  }
  for (var i = 0; i < min.length; i++) {
    out[i] = lerp(min[i], max[i], t);
  }
  return out;
}

function newArray (n, initialValue) {
  n = defined(n, 0);
  if (typeof n !== 'number') throw new TypeError('Expected n argument to be a number');
  var out = [];
  for (var i = 0; i < n; i++) out.push(initialValue);
  return out;
}

function linspace (n, opts) {
  n = defined(n, 0);
  if (typeof n !== 'number') throw new TypeError('Expected n argument to be a number');
  opts = opts || {};
  if (typeof opts === 'boolean') {
    opts = { endpoint: true };
  }
  var offset = defined(opts.offset, 0);
  if (opts.endpoint) {
    return newArray(n).map(function (_, i) {
      return n <= 1 ? 0 : ((i + offset) / (n - 1));
    });
  } else {
    return newArray(n).map(function (_, i) {
      return (i + offset) / n;
    });
  }
}

function lerpFrames (values, t, out) {
  t = clamp(t, 0, 1);

  var len = values.length - 1;
  var whole = t * len;
  var frame = Math.floor(whole);
  var fract = whole - frame;

  var nextFrame = Math.min(frame + 1, len);
  var a = values[frame % values.length];
  var b = values[nextFrame % values.length];
  if (typeof a === 'number' && typeof b === 'number') {
    return lerp(a, b, fract);
  } else if (Array.isArray(a) && Array.isArray(b)) {
    return lerpArray(a, b, fract, out);
  } else {
    throw new TypeError('Mismatch in value type of two array elements: ' + frame + ' and ' + nextFrame);
  }
}

function mod (a, b) {
  return ((a % b) + b) % b;
}

function degToRad (n) {
  return n * Math.PI / 180;
}

function radToDeg (n) {
  return n * 180 / Math.PI;
}

function fract (n) {
  return n - Math.floor(n);
}

function sign (n) {
  if (n > 0) return 1;
  else if (n < 0) return -1;
  else return 0;
}

// Specific function from Unity / ofMath, not sure its needed?
// function lerpWrap (a, b, t, min, max) {
//   return wrap(a + wrap(b - a, min, max) * t, min, max)
// }

function pingPong (t, length) {
  t = mod(t, length * 2);
  return length - Math.abs(t - length);
}

function damp (a, b, lambda, dt) {
  return lerp(a, b, 1 - Math.exp(-lambda * dt));
}

function dampArray (a, b, lambda, dt, out) {
  out = out || [];
  for (var i = 0; i < a.length; i++) {
    out[i] = damp(a[i], b[i], lambda, dt);
  }
  return out;
}

function mapRange (value, inputMin, inputMax, outputMin, outputMax, clamp) {
  // Reference:
  // https://openframeworks.cc/documentation/math/ofMath/
  if (Math.abs(inputMin - inputMax) < EPSILON) {
    return outputMin;
  } else {
    var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
    if (clamp) {
      if (outputMax < outputMin) {
        if (outVal < outputMax) outVal = outputMax;
        else if (outVal > outputMin) outVal = outputMin;
      } else {
        if (outVal > outputMax) outVal = outputMax;
        else if (outVal < outputMin) outVal = outputMin;
      }
    }
    return outVal;
  }
}

module.exports = {
  mod: mod,
  fract: fract,
  sign: sign,
  degToRad: degToRad,
  radToDeg: radToDeg,
  wrap: wrap,
  pingPong: pingPong,
  linspace: linspace,
  lerp: lerp,
  lerpArray: lerpArray,
  inverseLerp: inverseLerp,
  lerpFrames: lerpFrames,
  clamp: clamp,
  clamp01: clamp01,
  smoothstep: smoothstep,
  damp: damp,
  dampArray: dampArray,
  mapRange: mapRange,
  expand2D: expandVector(2),
  expand3D: expandVector(3),
  expand4D: expandVector(4)
};

},{"defined":"node_modules/defined/index.js","./lib/wrap":"node_modules/canvas-sketch-util/lib/wrap.js"}],"node_modules/seed-random/index.js":[function(require,module,exports) {
var global = arguments[3];
'use strict';

var width = 256;// each RC4 output is 0 <= x < 256
var chunks = 6;// at least six RC4 outputs for each double
var digits = 52;// there are 52 significant digits in a double
var pool = [];// pool: entropy pool starts empty
var GLOBAL = typeof global === 'undefined' ? window : global;

//
// The following constants are related to IEEE 754 limits.
//
var startdenom = Math.pow(width, chunks),
    significance = Math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1;


var oldRandom = Math.random;

//
// seedrandom()
// This is the seedrandom function described above.
//
module.exports = function(seed, options) {
  if (options && options.global === true) {
    options.global = false;
    Math.random = module.exports(seed, options);
    options.global = true;
    return Math.random;
  }
  var use_entropy = (options && options.entropy) || false;
  var key = [];

  // Flatten the seed string or build one from local entropy if needed.
  var shortseed = mixkey(flatten(
    use_entropy ? [seed, tostring(pool)] :
    0 in arguments ? seed : autoseed(), 3), key);

  // Use the seed to initialize an ARC4 generator.
  var arc4 = new ARC4(key);

  // Mix the randomness into accumulated entropy.
  mixkey(tostring(arc4.S), pool);

  // Override Math.random

  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.

  return function() {         // Closure to return a random double:
    var n = arc4.g(chunks),             // Start with a numerator n < 2 ^ 48
        d = startdenom,                 //   and denominator d = 2 ^ 48.
        x = 0;                          //   and no 'extra last byte'.
    while (n < significance) {          // Fill up all significant digits by
      n = (n + x) * width;              //   shifting numerator and
      d *= width;                       //   denominator and generating a
      x = arc4.g(1);                    //   new least-significant-byte.
    }
    while (n >= overflow) {             // To avoid rounding up, before adding
      n /= 2;                           //   last byte, shift everything
      d /= 2;                           //   right using integer Math until
      x >>>= 1;                         //   we have exactly the desired bits.
    }
    return (n + x) / d;                 // Form the number within [0, 1).
  };
};

module.exports.resetGlobal = function () {
  Math.random = oldRandom;
};

//
// ARC4
//
// An ARC4 implementation.  The constructor takes a key in the form of
// an array of at most (width) integers that should be 0 <= x < (width).
//
// The g(count) method returns a pseudorandom integer that concatenates
// the next (count) outputs from ARC4.  Its return value is a number x
// that is in the range 0 <= x < (width ^ count).
//
/** @constructor */
function ARC4(key) {
  var t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = [];

  // The empty key [] is treated as [0].
  if (!keylen) { key = [keylen++]; }

  // Set up S using the standard key scheduling algorithm.
  while (i < width) {
    s[i] = i++;
  }
  for (i = 0; i < width; i++) {
    s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
    s[j] = t;
  }

  // The "g" method returns the next (count) outputs as one number.
  (me.g = function(count) {
    // Using instance members instead of closure state nearly doubles speed.
    var t, r = 0,
        i = me.i, j = me.j, s = me.S;
    while (count--) {
      t = s[i = mask & (i + 1)];
      r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
    }
    me.i = i; me.j = j;
    return r;
    // For robust unpredictability discard an initial batch of values.
    // See http://www.rsa.com/rsalabs/node.asp?id=2009
  })(width);
}

//
// flatten()
// Converts an object tree to nested arrays of strings.
//
function flatten(obj, depth) {
  var result = [], typ = (typeof obj)[0], prop;
  if (depth && typ == 'o') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)); } catch (e) {}
    }
  }
  return (result.length ? result : typ == 's' ? obj : obj + '\0');
}

//
// mixkey()
// Mixes a string seed into a key that is an array of integers, and
// returns a shortened string seed that is equivalent to the result key.
//
function mixkey(seed, key) {
  var stringseed = seed + '', smear, j = 0;
  while (j < stringseed.length) {
    key[mask & j] =
      mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
  }
  return tostring(key);
}

//
// autoseed()
// Returns an object for autoseeding, using window.crypto if available.
//
/** @param {Uint8Array=} seed */
function autoseed(seed) {
  try {
    GLOBAL.crypto.getRandomValues(seed = new Uint8Array(width));
    return tostring(seed);
  } catch (e) {
    return [+new Date, GLOBAL, GLOBAL.navigator && GLOBAL.navigator.plugins,
            GLOBAL.screen, tostring(pool)];
  }
}

//
// tostring()
// Converts an array of charcodes to a string
//
function tostring(a) {
  return String.fromCharCode.apply(0, a);
}

//
// When seedrandom.js is loaded, we immediately mix a few bits
// from the built-in RNG into the entropy pool.  Because we do
// not want to intefere with determinstic PRNG state later,
// seedrandom will not call Math.random on its own again after
// initialization.
//
mixkey(Math.random(), pool);

},{}],"node_modules/simplex-noise/simplex-noise.js":[function(require,module,exports) {
var define;
/*
 * A fast javascript implementation of simplex noise by Jonas Wagner

Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
Better rank ordering method by Stefan Gustavson in 2012.


 Copyright (c) 2018 Jonas Wagner

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
(function() {
  'use strict';

  var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  var F3 = 1.0 / 3.0;
  var G3 = 1.0 / 6.0;
  var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function SimplexNoise(randomOrSeed) {
    var random;
    if (typeof randomOrSeed == 'function') {
      random = randomOrSeed;
    }
    else if (randomOrSeed) {
      random = alea(randomOrSeed);
    } else {
      random = Math.random;
    }
    this.p = buildPermutationTable(random);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);
    for (var i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }

  }
  SimplexNoise.prototype = {
    grad3: new Float32Array([1, 1, 0,
      -1, 1, 0,
      1, -1, 0,

      -1, -1, 0,
      1, 0, 1,
      -1, 0, 1,

      1, 0, -1,
      -1, 0, -1,
      0, 1, 1,

      0, -1, 1,
      0, 1, -1,
      0, -1, -1]),
    grad4: new Float32Array([0, 1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1,
      0, -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1,
      1, 0, 1, 1, 1, 0, 1, -1, 1, 0, -1, 1, 1, 0, -1, -1,
      -1, 0, 1, 1, -1, 0, 1, -1, -1, 0, -1, 1, -1, 0, -1, -1,
      1, 1, 0, 1, 1, 1, 0, -1, 1, -1, 0, 1, 1, -1, 0, -1,
      -1, 1, 0, 1, -1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, -1,
      1, 1, 1, 0, 1, 1, -1, 0, 1, -1, 1, 0, 1, -1, -1, 0,
      -1, 1, 1, 0, -1, 1, -1, 0, -1, -1, 1, 0, -1, -1, -1, 0]),
    noise2D: function(xin, yin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0 = 0; // Noise contributions from the three corners
      var n1 = 0;
      var n2 = 0;
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin) * F2; // Hairy factor for 2D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * G2;
      var X0 = i - t; // Unskew the cell origin back to (x,y) space
      var Y0 = j - t;
      var x0 = xin - X0; // The x,y distances from the cell origin
      var y0 = yin - Y0;
      // For the 2D case, the simplex shape is an equilateral triangle.
      // Determine which simplex we are in.
      var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
      if (x0 > y0) {
        i1 = 1;
        j1 = 0;
      } // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      else {
        i1 = 0;
        j1 = 1;
      } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
      // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
      // c = (3-sqrt(3))/6
      var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
      var y1 = y0 - j1 + G2;
      var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
      var y2 = y0 - 1.0 + 2.0 * G2;
      // Work out the hashed gradient indices of the three simplex corners
      var ii = i & 255;
      var jj = j & 255;
      // Calculate the contribution from the three corners
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        var gi0 = permMod12[ii + perm[jj]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0); // (x,y) of grad3 used for 2D gradient
      }
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        var gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
      }
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        var gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to return values in the interval [-1,1].
      return 70.0 * (n0 + n1 + n2);
    },
    // 3D simplex noise
    noise3D: function(xin, yin, zin) {
      var permMod12 = this.permMod12;
      var perm = this.perm;
      var grad3 = this.grad3;
      var n0, n1, n2, n3; // Noise contributions from the four corners
      // Skew the input space to determine which simplex cell we're in
      var s = (xin + yin + zin) * F3; // Very nice and simple skew factor for 3D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var X0 = i - t; // Unskew the cell origin back to (x,y,z) space
      var Y0 = j - t;
      var Z0 = k - t;
      var x0 = xin - X0; // The x,y,z distances from the cell origin
      var y0 = yin - Y0;
      var z0 = zin - Z0;
      // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
      // Determine which simplex we are in.
      var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
      var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
      if (x0 >= y0) {
        if (y0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // X Y Z order
        else if (x0 >= z0) {
          i1 = 1;
          j1 = 0;
          k1 = 0;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // X Z Y order
        else {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 1;
          j2 = 0;
          k2 = 1;
        } // Z X Y order
      }
      else { // x0<y0
        if (y0 < z0) {
          i1 = 0;
          j1 = 0;
          k1 = 1;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Z Y X order
        else if (x0 < z0) {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 0;
          j2 = 1;
          k2 = 1;
        } // Y Z X order
        else {
          i1 = 0;
          j1 = 1;
          k1 = 0;
          i2 = 1;
          j2 = 1;
          k2 = 0;
        } // Y X Z order
      }
      // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
      // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
      // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
      // c = 1/6.
      var x1 = x0 - i1 + G3; // Offsets for second corner in (x,y,z) coords
      var y1 = y0 - j1 + G3;
      var z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2.0 * G3; // Offsets for third corner in (x,y,z) coords
      var y2 = y0 - j2 + 2.0 * G3;
      var z2 = z0 - k2 + 2.0 * G3;
      var x3 = x0 - 1.0 + 3.0 * G3; // Offsets for last corner in (x,y,z) coords
      var y3 = y0 - 1.0 + 3.0 * G3;
      var z3 = z0 - 1.0 + 3.0 * G3;
      // Work out the hashed gradient indices of the four simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      // Calculate the contribution from the four corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = permMod12[ii + perm[jj + perm[kk]]] * 3;
        t0 *= t0;
        n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0 + grad3[gi0 + 2] * z0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
        t1 *= t1;
        n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1 + grad3[gi1 + 2] * z1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
        t2 *= t2;
        n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2 + grad3[gi2 + 2] * z2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
        t3 *= t3;
        n3 = t3 * t3 * (grad3[gi3] * x3 + grad3[gi3 + 1] * y3 + grad3[gi3 + 2] * z3);
      }
      // Add contributions from each corner to get the final noise value.
      // The result is scaled to stay just inside [-1,1]
      return 32.0 * (n0 + n1 + n2 + n3);
    },
    // 4D simplex noise, better simplex rank ordering method 2012-03-09
    noise4D: function(x, y, z, w) {
      var perm = this.perm;
      var grad4 = this.grad4;

      var n0, n1, n2, n3, n4; // Noise contributions from the five corners
      // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
      var s = (x + y + z + w) * F4; // Factor for 4D skewing
      var i = Math.floor(x + s);
      var j = Math.floor(y + s);
      var k = Math.floor(z + s);
      var l = Math.floor(w + s);
      var t = (i + j + k + l) * G4; // Factor for 4D unskewing
      var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
      var Y0 = j - t;
      var Z0 = k - t;
      var W0 = l - t;
      var x0 = x - X0; // The x,y,z,w distances from the cell origin
      var y0 = y - Y0;
      var z0 = z - Z0;
      var w0 = w - W0;
      // For the 4D case, the simplex is a 4D shape I won't even try to describe.
      // To find out which of the 24 possible simplices we're in, we need to
      // determine the magnitude ordering of x0, y0, z0 and w0.
      // Six pair-wise comparisons are performed between each possible pair
      // of the four coordinates, and the results are used to rank the numbers.
      var rankx = 0;
      var ranky = 0;
      var rankz = 0;
      var rankw = 0;
      if (x0 > y0) rankx++;
      else ranky++;
      if (x0 > z0) rankx++;
      else rankz++;
      if (x0 > w0) rankx++;
      else rankw++;
      if (y0 > z0) ranky++;
      else rankz++;
      if (y0 > w0) ranky++;
      else rankw++;
      if (z0 > w0) rankz++;
      else rankw++;
      var i1, j1, k1, l1; // The integer offsets for the second simplex corner
      var i2, j2, k2, l2; // The integer offsets for the third simplex corner
      var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner
      // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
      // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
      // impossible. Only the 24 indices which have non-zero entries make any sense.
      // We use a thresholding to set the coordinates in turn from the largest magnitude.
      // Rank 3 denotes the largest coordinate.
      i1 = rankx >= 3 ? 1 : 0;
      j1 = ranky >= 3 ? 1 : 0;
      k1 = rankz >= 3 ? 1 : 0;
      l1 = rankw >= 3 ? 1 : 0;
      // Rank 2 denotes the second largest coordinate.
      i2 = rankx >= 2 ? 1 : 0;
      j2 = ranky >= 2 ? 1 : 0;
      k2 = rankz >= 2 ? 1 : 0;
      l2 = rankw >= 2 ? 1 : 0;
      // Rank 1 denotes the second smallest coordinate.
      i3 = rankx >= 1 ? 1 : 0;
      j3 = ranky >= 1 ? 1 : 0;
      k3 = rankz >= 1 ? 1 : 0;
      l3 = rankw >= 1 ? 1 : 0;
      // The fifth corner has all coordinate offsets = 1, so no need to compute that.
      var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
      var y1 = y0 - j1 + G4;
      var z1 = z0 - k1 + G4;
      var w1 = w0 - l1 + G4;
      var x2 = x0 - i2 + 2.0 * G4; // Offsets for third corner in (x,y,z,w) coords
      var y2 = y0 - j2 + 2.0 * G4;
      var z2 = z0 - k2 + 2.0 * G4;
      var w2 = w0 - l2 + 2.0 * G4;
      var x3 = x0 - i3 + 3.0 * G4; // Offsets for fourth corner in (x,y,z,w) coords
      var y3 = y0 - j3 + 3.0 * G4;
      var z3 = z0 - k3 + 3.0 * G4;
      var w3 = w0 - l3 + 3.0 * G4;
      var x4 = x0 - 1.0 + 4.0 * G4; // Offsets for last corner in (x,y,z,w) coords
      var y4 = y0 - 1.0 + 4.0 * G4;
      var z4 = z0 - 1.0 + 4.0 * G4;
      var w4 = w0 - 1.0 + 4.0 * G4;
      // Work out the hashed gradient indices of the five simplex corners
      var ii = i & 255;
      var jj = j & 255;
      var kk = k & 255;
      var ll = l & 255;
      // Calculate the contribution from the five corners
      var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0 - w0 * w0;
      if (t0 < 0) n0 = 0.0;
      else {
        var gi0 = (perm[ii + perm[jj + perm[kk + perm[ll]]]] % 32) * 4;
        t0 *= t0;
        n0 = t0 * t0 * (grad4[gi0] * x0 + grad4[gi0 + 1] * y0 + grad4[gi0 + 2] * z0 + grad4[gi0 + 3] * w0);
      }
      var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1 - w1 * w1;
      if (t1 < 0) n1 = 0.0;
      else {
        var gi1 = (perm[ii + i1 + perm[jj + j1 + perm[kk + k1 + perm[ll + l1]]]] % 32) * 4;
        t1 *= t1;
        n1 = t1 * t1 * (grad4[gi1] * x1 + grad4[gi1 + 1] * y1 + grad4[gi1 + 2] * z1 + grad4[gi1 + 3] * w1);
      }
      var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2 - w2 * w2;
      if (t2 < 0) n2 = 0.0;
      else {
        var gi2 = (perm[ii + i2 + perm[jj + j2 + perm[kk + k2 + perm[ll + l2]]]] % 32) * 4;
        t2 *= t2;
        n2 = t2 * t2 * (grad4[gi2] * x2 + grad4[gi2 + 1] * y2 + grad4[gi2 + 2] * z2 + grad4[gi2 + 3] * w2);
      }
      var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3 - w3 * w3;
      if (t3 < 0) n3 = 0.0;
      else {
        var gi3 = (perm[ii + i3 + perm[jj + j3 + perm[kk + k3 + perm[ll + l3]]]] % 32) * 4;
        t3 *= t3;
        n3 = t3 * t3 * (grad4[gi3] * x3 + grad4[gi3 + 1] * y3 + grad4[gi3 + 2] * z3 + grad4[gi3 + 3] * w3);
      }
      var t4 = 0.6 - x4 * x4 - y4 * y4 - z4 * z4 - w4 * w4;
      if (t4 < 0) n4 = 0.0;
      else {
        var gi4 = (perm[ii + 1 + perm[jj + 1 + perm[kk + 1 + perm[ll + 1]]]] % 32) * 4;
        t4 *= t4;
        n4 = t4 * t4 * (grad4[gi4] * x4 + grad4[gi4 + 1] * y4 + grad4[gi4 + 2] * z4 + grad4[gi4 + 3] * w4);
      }
      // Sum up and scale the result to cover the range [-1,1]
      return 27.0 * (n0 + n1 + n2 + n3 + n4);
    }
  };

  function buildPermutationTable(random) {
    var i;
    var p = new Uint8Array(256);
    for (i = 0; i < 256; i++) {
      p[i] = i;
    }
    for (i = 0; i < 255; i++) {
      var r = i + ~~(random() * (256 - i));
      var aux = p[i];
      p[i] = p[r];
      p[r] = aux;
    }
    return p;
  }
  SimplexNoise._buildPermutationTable = buildPermutationTable;

  function alea() {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    var mash = masher();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < arguments.length; i++) {
      s0 -= mash(arguments[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(arguments[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(arguments[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;
    return function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
  }
  function masher() {
    var n = 0xefc8249d;
    return function(data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };
  }

  // amd
  if (typeof define !== 'undefined' && define.amd) define(function() {return SimplexNoise;});
  // common js
  if (typeof exports !== 'undefined') exports.SimplexNoise = SimplexNoise;
  // browser
  else if (typeof window !== 'undefined') window.SimplexNoise = SimplexNoise;
  // nodejs
  if (typeof module !== 'undefined') {
    module.exports = SimplexNoise;
  }

})();

},{}],"node_modules/canvas-sketch-util/random.js":[function(require,module,exports) {
var seedRandom = require('seed-random');
var SimplexNoise = require('simplex-noise');
var defined = require('defined');

function createRandom (defaultSeed) {
  defaultSeed = defined(defaultSeed, null);
  var defaultRandom = Math.random;
  var currentSeed;
  var currentRandom;
  var noiseGenerator;
  var _nextGaussian = null;
  var _hasNextGaussian = false;

  setSeed(defaultSeed);

  return {
    value: value,
    createRandom: function (defaultSeed) {
      return createRandom(defaultSeed);
    },
    setSeed: setSeed,
    getSeed: getSeed,
    getRandomSeed: getRandomSeed,
    valueNonZero: valueNonZero,
    permuteNoise: permuteNoise,
    noise1D: noise1D,
    noise2D: noise2D,
    noise3D: noise3D,
    noise4D: noise4D,
    sign: sign,
    boolean: boolean,
    chance: chance,
    range: range,
    rangeFloor: rangeFloor,
    pick: pick,
    shuffle: shuffle,
    onCircle: onCircle,
    insideCircle: insideCircle,
    onSphere: onSphere,
    insideSphere: insideSphere,
    quaternion: quaternion,
    weighted: weighted,
    weightedSet: weightedSet,
    weightedSetIndex: weightedSetIndex,
    gaussian: gaussian
  };

  function setSeed (seed, opt) {
    if (typeof seed === 'number' || typeof seed === 'string') {
      currentSeed = seed;
      currentRandom = seedRandom(currentSeed, opt);
    } else {
      currentSeed = undefined;
      currentRandom = defaultRandom;
    }
    noiseGenerator = createNoise();
    _nextGaussian = null;
    _hasNextGaussian = false;
  }

  function value () {
    return currentRandom();
  }

  function valueNonZero () {
    var u = 0;
    while (u === 0) u = value();
    return u;
  }

  function getSeed () {
    return currentSeed;
  }

  function getRandomSeed () {
    var seed = String(Math.floor(Math.random() * 1000000));
    return seed;
  }

  function createNoise () {
    return new SimplexNoise(currentRandom);
  }

  function permuteNoise () {
    noiseGenerator = createNoise();
  }

  function noise1D (x, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, 0);
  }

  function noise2D (x, y, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise2D(x * frequency, y * frequency);
  }

  function noise3D (x, y, z, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise3D(
      x * frequency,
      y * frequency,
      z * frequency
    );
  }

  function noise4D (x, y, z, w, frequency, amplitude) {
    if (!isFinite(x)) throw new TypeError('x component for noise() must be finite');
    if (!isFinite(y)) throw new TypeError('y component for noise() must be finite');
    if (!isFinite(z)) throw new TypeError('z component for noise() must be finite');
    if (!isFinite(w)) throw new TypeError('w component for noise() must be finite');
    frequency = defined(frequency, 1);
    amplitude = defined(amplitude, 1);
    return amplitude * noiseGenerator.noise4D(
      x * frequency,
      y * frequency,
      z * frequency,
      w * frequency
    );
  }

  function sign () {
    return boolean() ? 1 : -1;
  }

  function boolean () {
    return value() > 0.5;
  }

  function chance (n) {
    n = defined(n, 0.5);
    if (typeof n !== 'number') throw new TypeError('expected n to be a number');
    return value() < n;
  }

  function range (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return value() * (max - min) + min;
  }

  function rangeFloor (min, max) {
    if (max === undefined) {
      max = min;
      min = 0;
    }

    if (typeof min !== 'number' || typeof max !== 'number') {
      throw new TypeError('Expected all arguments to be numbers');
    }

    return Math.floor(range(min, max));
  }

  function pick (array) {
    if (array.length === 0) return undefined;
    return array[rangeFloor(0, array.length)];
  }

  function shuffle (arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('Expected Array, got ' + typeof arr);
    }

    var rand;
    var tmp;
    var len = arr.length;
    var ret = arr.slice();
    while (len) {
      rand = Math.floor(value() * len--);
      tmp = ret[len];
      ret[len] = ret[rand];
      ret[rand] = tmp;
    }
    return ret;
  }

  function onCircle (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var theta = value() * 2.0 * Math.PI;
    out[0] = radius * Math.cos(theta);
    out[1] = radius * Math.sin(theta);
    return out;
  }

  function insideCircle (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    onCircle(1, out);
    var r = radius * Math.sqrt(value());
    out[0] *= r;
    out[1] *= r;
    return out;
  }

  function onSphere (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var u = value() * Math.PI * 2;
    var v = value() * 2 - 1;
    var phi = u;
    var theta = Math.acos(v);
    out[0] = radius * Math.sin(theta) * Math.cos(phi);
    out[1] = radius * Math.sin(theta) * Math.sin(phi);
    out[2] = radius * Math.cos(theta);
    return out;
  }

  function insideSphere (radius, out) {
    radius = defined(radius, 1);
    out = out || [];
    var u = value() * Math.PI * 2;
    var v = value() * 2 - 1;
    var k = value();

    var phi = u;
    var theta = Math.acos(v);
    var r = radius * Math.cbrt(k);
    out[0] = r * Math.sin(theta) * Math.cos(phi);
    out[1] = r * Math.sin(theta) * Math.sin(phi);
    out[2] = r * Math.cos(theta);
    return out;
  }

  function quaternion (out) {
    out = out || [];
    var u1 = value();
    var u2 = value();
    var u3 = value();

    var sq1 = Math.sqrt(1 - u1);
    var sq2 = Math.sqrt(u1);

    var theta1 = Math.PI * 2 * u2;
    var theta2 = Math.PI * 2 * u3;

    var x = Math.sin(theta1) * sq1;
    var y = Math.cos(theta1) * sq1;
    var z = Math.sin(theta2) * sq2;
    var w = Math.cos(theta2) * sq2;
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  }

  function weightedSet (set) {
    set = set || [];
    if (set.length === 0) return null;
    return set[weightedSetIndex(set)].value;
  }

  function weightedSetIndex (set) {
    set = set || [];
    if (set.length === 0) return -1;
    return weighted(set.map(function (s) {
      return s.weight;
    }));
  }

  function weighted (weights) {
    weights = weights || [];
    if (weights.length === 0) return -1;
    var totalWeight = 0;
    var i;

    for (i = 0; i < weights.length; i++) {
      totalWeight += weights[i];
    }

    if (totalWeight <= 0) throw new Error('Weights must sum to > 0');

    var random = value() * totalWeight;
    for (i = 0; i < weights.length; i++) {
      if (random < weights[i]) {
        return i;
      }
      random -= weights[i];
    }
    return 0;
  }

  function gaussian (mean, standardDerivation) {
    mean = defined(mean, 0);
    standardDerivation = defined(standardDerivation, 1);

    // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496
    if (_hasNextGaussian) {
      _hasNextGaussian = false;
      var result = _nextGaussian;
      _nextGaussian = null;
      return mean + standardDerivation * result;
    } else {
      var v1 = 0;
      var v2 = 0;
      var s = 0;
      do {
        v1 = value() * 2 - 1; // between -1 and 1
        v2 = value() * 2 - 1; // between -1 and 1
        s = v1 * v1 + v2 * v2;
      } while (s >= 1 || s === 0);
      var multiplier = Math.sqrt(-2 * Math.log(s) / s);
      _nextGaussian = (v2 * multiplier);
      _hasNextGaussian = true;
      return mean + standardDerivation * (v1 * multiplier);
    }
  }
}

module.exports = createRandom();

},{"seed-random":"node_modules/seed-random/index.js","simplex-noise":"node_modules/simplex-noise/simplex-noise.js","defined":"node_modules/defined/index.js"}],"node_modules/nice-color-palettes/500.json":[function(require,module,exports) {
module.exports = [["#69d2e7","#a7dbd8","#e0e4cc","#f38630","#fa6900"],["#fe4365","#fc9d9a","#f9cdad","#c8c8a9","#83af9b"],["#ecd078","#d95b43","#c02942","#542437","#53777a"],["#556270","#4ecdc4","#c7f464","#ff6b6b","#c44d58"],["#774f38","#e08e79","#f1d4af","#ece5ce","#c5e0dc"],["#e8ddcb","#cdb380","#036564","#033649","#031634"],["#490a3d","#bd1550","#e97f02","#f8ca00","#8a9b0f"],["#594f4f","#547980","#45ada8","#9de0ad","#e5fcc2"],["#00a0b0","#6a4a3c","#cc333f","#eb6841","#edc951"],["#e94e77","#d68189","#c6a49a","#c6e5d9","#f4ead5"],["#3fb8af","#7fc7af","#dad8a7","#ff9e9d","#ff3d7f"],["#d9ceb2","#948c75","#d5ded9","#7a6a53","#99b2b7"],["#ffffff","#cbe86b","#f2e9e1","#1c140d","#cbe86b"],["#efffcd","#dce9be","#555152","#2e2633","#99173c"],["#343838","#005f6b","#008c9e","#00b4cc","#00dffc"],["#413e4a","#73626e","#b38184","#f0b49e","#f7e4be"],["#ff4e50","#fc913a","#f9d423","#ede574","#e1f5c4"],["#99b898","#fecea8","#ff847c","#e84a5f","#2a363b"],["#655643","#80bca3","#f6f7bd","#e6ac27","#bf4d28"],["#00a8c6","#40c0cb","#f9f2e7","#aee239","#8fbe00"],["#351330","#424254","#64908a","#e8caa4","#cc2a41"],["#554236","#f77825","#d3ce3d","#f1efa5","#60b99a"],["#5d4157","#838689","#a8caba","#cad7b2","#ebe3aa"],["#8c2318","#5e8c6a","#88a65e","#bfb35a","#f2c45a"],["#fad089","#ff9c5b","#f5634a","#ed303c","#3b8183"],["#ff4242","#f4fad2","#d4ee5e","#e1edb9","#f0f2eb"],["#f8b195","#f67280","#c06c84","#6c5b7b","#355c7d"],["#d1e751","#ffffff","#000000","#4dbce9","#26ade4"],["#1b676b","#519548","#88c425","#bef202","#eafde6"],["#5e412f","#fcebb6","#78c0a8","#f07818","#f0a830"],["#bcbdac","#cfbe27","#f27435","#f02475","#3b2d38"],["#452632","#91204d","#e4844a","#e8bf56","#e2f7ce"],["#eee6ab","#c5bc8e","#696758","#45484b","#36393b"],["#f0d8a8","#3d1c00","#86b8b1","#f2d694","#fa2a00"],["#2a044a","#0b2e59","#0d6759","#7ab317","#a0c55f"],["#f04155","#ff823a","#f2f26f","#fff7bd","#95cfb7"],["#b9d7d9","#668284","#2a2829","#493736","#7b3b3b"],["#bbbb88","#ccc68d","#eedd99","#eec290","#eeaa88"],["#b3cc57","#ecf081","#ffbe40","#ef746f","#ab3e5b"],["#a3a948","#edb92e","#f85931","#ce1836","#009989"],["#300030","#480048","#601848","#c04848","#f07241"],["#67917a","#170409","#b8af03","#ccbf82","#e33258"],["#aab3ab","#c4cbb7","#ebefc9","#eee0b7","#e8caaf"],["#e8d5b7","#0e2430","#fc3a51","#f5b349","#e8d5b9"],["#ab526b","#bca297","#c5ceae","#f0e2a4","#f4ebc3"],["#607848","#789048","#c0d860","#f0f0d8","#604848"],["#b6d8c0","#c8d9bf","#dadabd","#ecdbbc","#fedcba"],["#a8e6ce","#dcedc2","#ffd3b5","#ffaaa6","#ff8c94"],["#3e4147","#fffedf","#dfba69","#5a2e2e","#2a2c31"],["#fc354c","#29221f","#13747d","#0abfbc","#fcf7c5"],["#cc0c39","#e6781e","#c8cf02","#f8fcc1","#1693a7"],["#1c2130","#028f76","#b3e099","#ffeaad","#d14334"],["#a7c5bd","#e5ddcb","#eb7b59","#cf4647","#524656"],["#dad6ca","#1bb0ce","#4f8699","#6a5e72","#563444"],["#5c323e","#a82743","#e15e32","#c0d23e","#e5f04c"],["#edebe6","#d6e1c7","#94c7b6","#403b33","#d3643b"],["#fdf1cc","#c6d6b8","#987f69","#e3ad40","#fcd036"],["#230f2b","#f21d41","#ebebbc","#bce3c5","#82b3ae"],["#b9d3b0","#81bda4","#b28774","#f88f79","#f6aa93"],["#3a111c","#574951","#83988e","#bcdea5","#e6f9bc"],["#5e3929","#cd8c52","#b7d1a3","#dee8be","#fcf7d3"],["#1c0113","#6b0103","#a30006","#c21a01","#f03c02"],["#000000","#9f111b","#b11623","#292c37","#cccccc"],["#382f32","#ffeaf2","#fcd9e5","#fbc5d8","#f1396d"],["#e3dfba","#c8d6bf","#93ccc6","#6cbdb5","#1a1f1e"],["#f6f6f6","#e8e8e8","#333333","#990100","#b90504"],["#1b325f","#9cc4e4","#e9f2f9","#3a89c9","#f26c4f"],["#a1dbb2","#fee5ad","#faca66","#f7a541","#f45d4c"],["#c1b398","#605951","#fbeec2","#61a6ab","#accec0"],["#5e9fa3","#dcd1b4","#fab87f","#f87e7b","#b05574"],["#951f2b","#f5f4d7","#e0dfb1","#a5a36c","#535233"],["#8dccad","#988864","#fea6a2","#f9d6ac","#ffe9af"],["#2d2d29","#215a6d","#3ca2a2","#92c7a3","#dfece6"],["#413d3d","#040004","#c8ff00","#fa023c","#4b000f"],["#eff3cd","#b2d5ba","#61ada0","#248f8d","#605063"],["#ffefd3","#fffee4","#d0ecea","#9fd6d2","#8b7a5e"],["#cfffdd","#b4dec1","#5c5863","#a85163","#ff1f4c"],["#9dc9ac","#fffec7","#f56218","#ff9d2e","#919167"],["#4e395d","#827085","#8ebe94","#ccfc8e","#dc5b3e"],["#a8a7a7","#cc527a","#e8175d","#474747","#363636"],["#f8edd1","#d88a8a","#474843","#9d9d93","#c5cfc6"],["#046d8b","#309292","#2fb8ac","#93a42a","#ecbe13"],["#f38a8a","#55443d","#a0cab5","#cde9ca","#f1edd0"],["#a70267","#f10c49","#fb6b41","#f6d86b","#339194"],["#ff003c","#ff8a00","#fabe28","#88c100","#00c176"],["#ffedbf","#f7803c","#f54828","#2e0d23","#f8e4c1"],["#4e4d4a","#353432","#94ba65","#2790b0","#2b4e72"],["#0ca5b0","#4e3f30","#fefeeb","#f8f4e4","#a5b3aa"],["#4d3b3b","#de6262","#ffb88c","#ffd0b3","#f5e0d3"],["#fffbb7","#a6f6af","#66b6ab","#5b7c8d","#4f2958"],["#edf6ee","#d1c089","#b3204d","#412e28","#151101"],["#9d7e79","#ccac95","#9a947c","#748b83","#5b756c"],["#fcfef5","#e9ffe1","#cdcfb7","#d6e6c3","#fafbe3"],["#9cddc8","#bfd8ad","#ddd9ab","#f7af63","#633d2e"],["#30261c","#403831","#36544f","#1f5f61","#0b8185"],["#aaff00","#ffaa00","#ff00aa","#aa00ff","#00aaff"],["#d1313d","#e5625c","#f9bf76","#8eb2c5","#615375"],["#ffe181","#eee9e5","#fad3b2","#ffba7f","#ff9c97"],["#73c8a9","#dee1b6","#e1b866","#bd5532","#373b44"],["#805841","#dcf7f3","#fffcdd","#ffd8d8","#f5a2a2"],["#379f7a","#78ae62","#bbb749","#e0fbac","#1f1c0d"],["#caff42","#ebf7f8","#d0e0eb","#88abc2","#49708a"],["#c2412d","#d1aa34","#a7a844","#a46583","#5a1e4a"],["#75616b","#bfcff7","#dce4f7","#f8f3bf","#d34017"],["#111625","#341931","#571b3c","#7a1e48","#9d2053"],["#82837e","#94b053","#bdeb07","#bffa37","#e0e0e0"],["#7e5686","#a5aad9","#e8f9a2","#f8a13f","#ba3c3d"],["#312736","#d4838f","#d6abb1","#d9d9d9","#c4ffeb"],["#395a4f","#432330","#853c43","#f25c5e","#ffa566"],["#fde6bd","#a1c5ab","#f4dd51","#d11e48","#632f53"],["#84b295","#eccf8d","#bb8138","#ac2005","#2c1507"],["#058789","#503d2e","#d54b1a","#e3a72f","#f0ecc9"],["#6da67a","#77b885","#86c28b","#859987","#4a4857"],["#bed6c7","#adc0b4","#8a7e66","#a79b83","#bbb2a1"],["#261c21","#6e1e62","#b0254f","#de4126","#eb9605"],["#efd9b4","#d6a692","#a39081","#4d6160","#292522"],["#e21b5a","#9e0c39","#333333","#fbffe3","#83a300"],["#f2e3c6","#ffc6a5","#e6324b","#2b2b2b","#353634"],["#c75233","#c78933","#d6ceaa","#79b5ac","#5e2f46"],["#793a57","#4d3339","#8c873e","#d1c5a5","#a38a5f"],["#512b52","#635274","#7bb0a8","#a7dbab","#e4f5b1"],["#11644d","#a0b046","#f2c94e","#f78145","#f24e4e"],["#59b390","#f0ddaa","#e47c5d","#e32d40","#152b3c"],["#fdffd9","#fff0b8","#ffd6a3","#faad8e","#142f30"],["#b5ac01","#ecba09","#e86e1c","#d41e45","#1b1521"],["#c7fcd7","#d9d5a7","#d9ab91","#e6867a","#ed4a6a"],["#11766d","#410936","#a40b54","#e46f0a","#f0b300"],["#595643","#4e6b66","#ed834e","#ebcc6e","#ebe1c5"],["#f1396d","#fd6081","#f3ffeb","#acc95f","#8f9924"],["#331327","#991766","#d90f5a","#f34739","#ff6e27"],["#efeecc","#fe8b05","#fe0557","#400403","#0aabba"],["#bf496a","#b39c82","#b8c99d","#f0d399","#595151"],["#b7cbbf","#8c886f","#f9a799","#f4bfad","#f5dabd"],["#ffb884","#f5df98","#fff8d4","#c0d1c2","#2e4347"],["#e5eaa4","#a8c4a2","#69a5a4","#616382","#66245b"],["#e0eff1","#7db4b5","#ffffff","#680148","#000000"],["#b1e6d1","#77b1a9","#3d7b80","#270a33","#451a3e"],["#e4ded0","#abccbd","#7dbeb8","#181619","#e32f21"],["#e9e0d1","#91a398","#33605a","#070001","#68462b"],["#fc284f","#ff824a","#fea887","#f6e7f7","#d1d0d7"],["#ffab07","#e9d558","#72ad75","#0e8d94","#434d53"],["#6da67a","#99a66d","#a9bd68","#b5cc6a","#c0de5d"],["#311d39","#67434f","#9b8e7e","#c3ccaf","#a51a41"],["#cfb590","#9e9a41","#758918","#564334","#49281f"],["#5cacc4","#8cd19d","#cee879","#fcb653","#ff5254"],["#44749d","#c6d4e1","#ffffff","#ebe7e0","#bdb8ad"],["#807462","#a69785","#b8faff","#e8fdff","#665c49"],["#e7edea","#ffc52c","#fb0c06","#030d4f","#ceecef"],["#ccf390","#e0e05a","#f7c41f","#fc930a","#ff003d"],["#2b222c","#5e4352","#965d62","#c7956d","#f2d974"],["#cc5d4c","#fffec6","#c7d1af","#96b49c","#5b5847"],["#e4e4c5","#b9d48b","#8d2036","#ce0a31","#d3e4c5"],["#e3e8cd","#bcd8bf","#d3b9a3","#ee9c92","#fe857e"],["#360745","#d61c59","#e7d84b","#efeac5","#1b8798"],["#ec4401","#cc9b25","#13cd4a","#7b6ed6","#5e525c"],["#eb9c4d","#f2d680","#f3ffcf","#bac9a9","#697060"],["#f2e8c4","#98d9b6","#3ec9a7","#2b879e","#616668"],["#f5dd9d","#bcc499","#92a68a","#7b8f8a","#506266"],["#fff3db","#e7e4d5","#d3c8b4","#c84648","#703e3b"],["#041122","#259073","#7fda89","#c8e98e","#e6f99d"],["#8d7966","#a8a39d","#d8c8b8","#e2ddd9","#f8f1e9"],["#c6cca5","#8ab8a8","#6b9997","#54787d","#615145"],["#1d1313","#24b694","#d22042","#a3b808","#30c4c9"],["#4b1139","#3b4058","#2a6e78","#7a907c","#c9b180"],["#2d1b33","#f36a71","#ee887a","#e4e391","#9abc8a"],["#f0ffc9","#a9da88","#62997a","#72243d","#3b0819"],["#429398","#6b5d4d","#b0a18f","#dfcdb4","#fbeed3"],["#9d9e94","#c99e93","#f59d92","#e5b8ad","#d5d2c8"],["#95a131","#c8cd3b","#f6f1de","#f5b9ae","#ee0b5b"],["#322938","#89a194","#cfc89a","#cc883a","#a14016"],["#540045","#c60052","#ff714b","#eaff87","#acffe9"],["#79254a","#795c64","#79927d","#aeb18e","#e3cf9e"],["#452e3c","#ff3d5a","#ffb969","#eaf27e","#3b8c88"],["#2b2726","#0a516d","#018790","#7dad93","#bacca4"],["#027b7f","#ffa588","#d62957","#bf1e62","#572e4f"],["#fa6a64","#7a4e48","#4a4031","#f6e2bb","#9ec6b8"],["#fb6900","#f63700","#004853","#007e80","#00b9bd"],["#f06d61","#da825f","#c4975c","#a8ab7b","#8cbf99"],["#23192d","#fd0a54","#f57576","#febf97","#f5ecb7"],["#f6d76b","#ff9036","#d6254d","#ff5475","#fdeba9"],["#a3c68c","#879676","#6e6662","#4f364a","#340735"],["#a32c28","#1c090b","#384030","#7b8055","#bca875"],["#80a8a8","#909d9e","#a88c8c","#ff0d51","#7a8c89"],["#6d9788","#1e2528","#7e1c13","#bf0a0d","#e6e1c2"],["#373737","#8db986","#acce91","#badb73","#efeae4"],["#e6b39a","#e6cba5","#ede3b4","#8b9e9b","#6d7578"],["#280904","#680e34","#9a151a","#c21b12","#fc4b2a"],["#4b3e4d","#1e8c93","#dbd8a2","#c4ac30","#d74f33"],["#161616","#c94d65","#e7c049","#92b35a","#1f6764"],["#234d20","#36802d","#77ab59","#c9df8a","#f0f7da"],["#a69e80","#e0ba9b","#e7a97e","#d28574","#3b1922"],["#641f5e","#676077","#65ac92","#c2c092","#edd48e"],["#e6eba9","#abbb9f","#6f8b94","#706482","#703d6f"],["#26251c","#eb0a44","#f2643d","#f2a73d","#a0e8b7"],["#fdcfbf","#feb89f","#e23d75","#5f0d3b","#742365"],["#ff7474","#f59b71","#c7c77f","#e0e0a8","#f1f1c1"],["#4f364c","#5e405f","#6b6b6b","#8f9e6f","#b1cf72"],["#230b00","#a29d7f","#d4cfa5","#f8ecd4","#aabe9b"],["#d4f7dc","#dbe7b4","#dbc092","#e0846d","#f51441"],["#62a07b","#4f8b89","#536c8d","#5c4f79","#613860"],["#6f5846","#a95a52","#e35b5d","#f18052","#ffa446"],["#85847e","#ab6a6e","#f7345b","#353130","#cbcfb4"],["#ff3366","#c74066","#8f4d65","#575a65","#1f6764"],["#d3d5b0","#b5cea4","#9dc19d","#8c7c62","#71443f"],["#ffff99","#d9cc8c","#b39980","#8c6673","#663366"],["#ed6464","#bf6370","#87586c","#574759","#1a1b1c"],["#d24858","#ea8676","#eab05e","#fdeecd","#493831"],["#f0f0d8","#b4debe","#77cca4","#666666","#b4df37"],["#f3e7d7","#f7d7cd","#f8c7c9","#e0c0c7","#c7b9c5"],["#ccb24c","#f7d683","#fffdc0","#fffffd","#457d97"],["#1a081f","#4d1d4d","#05676e","#489c79","#ebc288"],["#c46564","#f0e999","#b8c99d","#9b726f","#eeb15b"],["#7a5b3e","#fafafa","#fa4b00","#cdbdae","#1f1f1f"],["#eeda95","#b7c27e","#9a927b","#8a6a6b","#805566"],["#d31900","#ff6600","#fff2af","#7cb490","#000000"],["#e8c382","#b39d69","#a86b4c","#7d1a0c","#340a0b"],["#ebeaa9","#ebc588","#7d2948","#3b0032","#0e0b29"],["#566965","#948a71","#cc9476","#f2a176","#ff7373"],["#595b5a","#14c3a2","#0de5a8","#7cf49a","#b8fd99"],["#063940","#195e63","#3e838c","#8ebdb6","#ece1c3"],["#411f2d","#ac4147","#f88863","#ffc27f","#ffe29a"],["#9dbcbc","#f0f0af","#ff370f","#332717","#6bacbf"],["#e7e79d","#c0d890","#78a890","#606078","#d8a878"],["#94654c","#f89fa1","#fabdbd","#fad6d6","#fefcd0"],["#cddbc2","#f7e4c6","#fb9274","#f5565b","#875346"],["#f0ddbd","#ba3622","#851e25","#520c30","#1c997f"],["#312c20","#494d4b","#7c7052","#b3a176","#e2cb92"],["#029daf","#e5d599","#ffc219","#f07c19","#e32551"],["#3f2c26","#dd423e","#a2a384","#eac388","#c5ad4b"],["#0a0310","#49007e","#ff005b","#ff7d10","#ffb238"],["#ecbe13","#738c79","#6a6b5f","#2c2b26","#a43955"],["#fff5de","#b8d9c8","#917081","#750e49","#4d002b"],["#1f1f20","#2b4c7e","#567ebb","#606d80","#dce0e6"],["#e7dd96","#e16639","#ad860a","#b7023f","#55024a"],["#cdeccc","#edd269","#e88460","#f23460","#321d2e"],["#574c41","#e36b6b","#e3a56b","#e3c77b","#96875a"],["#dde0cf","#c6be9a","#ad8b32","#937460","#8c5b7b"],["#213435","#46685b","#648a64","#a6b985","#e1e3ac"],["#181419","#4a073c","#9e0b41","#cc3e18","#f0971c"],["#413040","#6c6368","#b9a173","#eaa353","#ffefa9"],["#4d3b36","#eb613b","#f98f6f","#c1d9cd","#f7eadc"],["#ffcdb8","#fdeecf","#c8c696","#97bea9","#37260c"],["#e8d3a9","#e39b7d","#6e6460","#89b399","#bcbfa3"],["#ffffff","#fffaeb","#f0f0d8","#cfcfcf","#967c52"],["#001449","#012677","#005bc5","#00b4fc","#17f9ff"],["#ed5672","#160e32","#9eae8a","#cdbb93","#fbc599"],["#130912","#3e1c33","#602749","#b14623","#f6921d"],["#ffff00","#ccd91a","#99b333","#668c4d","#336666"],["#4dab8c","#542638","#8f244d","#c9306b","#e86f9e"],["#2b1719","#02483e","#057c46","#9bb61b","#f8be00"],["#ffabab","#ffdaab","#ddffab","#abe4ff","#d9abff"],["#e6a06f","#9e9c71","#5e8271","#33454e","#242739"],["#67be9b","#95d0b8","#fcfcd7","#f1db42","#f04158"],["#1693a5","#45b5c4","#7ececa","#a0ded6","#c7ede8"],["#cc2649","#992c4b","#66324c","#33384e","#003e4f"],["#e7eed0","#cad1c3","#948e99","#51425f","#2e1437"],["#785d56","#be4c54","#c6b299","#e6d5c1","#fff4e3"],["#f7f3d5","#ffdabf","#fa9b9b","#e88087","#635063"],["#e25858","#e9d6af","#ffffdd","#c0efd2","#384252"],["#acdeb2","#e1eab5","#edad9e","#fe4b74","#390d2d"],["#42282c","#6ca19e","#84abaa","#ded1b6","#6d997a"],["#a7cd2c","#bada5f","#cee891","#e1f5c4","#50c8c6"],["#b2cba3","#e0df9f","#e7a83e","#9a736e","#ea525f"],["#fc580c","#fc6b0a","#f8872e","#ffa927","#fdca49"],["#fdffd9","#73185e","#36bba6","#0c0d02","#8b911a"],["#9f0a28","#d55c2b","#f6e7d3","#89a46f","#55203c"],["#8a8780","#e6e5c4","#d6d1af","#e47267","#d7d8c5"],["#418e8e","#5a4e3c","#c4d428","#d8e472","#e9ebbf"],["#a69a90","#4a403d","#fff1c1","#facf7d","#ea804c"],["#faf6d0","#c7d8ab","#909a92","#744f78","#30091e"],["#aadead","#bbdead","#ccdead","#dddead","#eedead"],["#f0371a","#000000","#f7e6a6","#3e6b48","#b5b479"],["#a7321c","#ffdc68","#cc982a","#928941","#352504"],["#fa2e59","#ff703f","#f7bc05","#ecf6bb","#76bcad"],["#f1e8b4","#b2bb91","#d7bf5e","#d16344","#83555e"],["#afc7b9","#ffe1c9","#fac7b4","#fca89d","#998b82"],["#f6c7b7","#f7a398","#fa7f77","#b42529","#000000"],["#c9d1d3","#f7f7f7","#9dd3df","#3b3737","#991818"],["#000000","#001f36","#1c5560","#79ae92","#fbffcd"],["#e0dc8b","#f6aa3d","#ed4c57","#574435","#6cc4b9"],["#42393b","#75c9a3","#bac99a","#ffc897","#f7efa2"],["#f4f4f4","#9ba657","#f0e5c9","#a68c69","#594433"],["#f2cc67","#f38264","#f40034","#5f051f","#75baa8"],["#fbfee5","#c91842","#98173d","#25232d","#a8e7ca"],["#dbd9b7","#c1c9c8","#a5b5ab","#949a8e","#615566"],["#f3e6bc","#f1c972","#f5886b","#72ae95","#5a3226"],["#674f23","#e48b69","#e1b365","#e5db84","#ffeeac"],["#ff0092","#ffca1b","#b6ff00","#228dff","#ba01ff"],["#d9d4a8","#d15c57","#cc3747","#5c374b","#4a5f67"],["#998496","#f7e0ae","#fa748f","#2d2c26","#c3b457"],["#fa8cb1","#fdc5c9","#fffee1","#cfb699","#9e6d4e"],["#84c1b1","#ad849a","#d64783","#fd135a","#40202a"],["#00ccbe","#09a6a3","#9dbfaf","#edebc9","#fcf9d8"],["#020304","#541f14","#938172","#cc9e61","#626266"],["#71dbd2","#eeffdb","#ade4b5","#d0eaa3","#fff18c"],["#b88000","#d56f00","#f15500","#ff2654","#ff0c71"],["#bf2a23","#a6ad3c","#f0ce4e","#cf872e","#8a211d"],["#ffc870","#f7f7c6","#c8e3c5","#9cad9a","#755858"],["#002c2b","#ff3d00","#ffbc11","#0a837f","#076461"],["#244242","#51bd9c","#a3e3b1","#ffe8b3","#ff2121"],["#4eb3de","#8de0a6","#fcf09f","#f27c7c","#de528c"],["#001848","#301860","#483078","#604878","#906090"],["#1f0310","#442433","#a3d95b","#aae3ab","#f6f0bc"],["#b31237","#f03813","#ff8826","#ffb914","#2c9fa3"],["#fffdc0","#b9d7a1","#fead26","#ca221f","#590f0c"],["#4c3d31","#f18273","#f2bd76","#f4f5de","#c4ceb0"],["#84bfc3","#fff5d6","#ffb870","#d96153","#000511"],["#e2df9a","#ebe54d","#757449","#4b490b","#ff0051"],["#b2b39f","#c8c9b5","#dedfc5","#f5f7bd","#3d423c"],["#2f2bad","#ad2bad","#e42692","#f71568","#f7db15"],["#651366","#a71a5b","#e7204e","#f76e2a","#f0c505"],["#241811","#d4a979","#e3c88f","#c2c995","#a8bd95"],["#2197a3","#f71e6c","#f07868","#ebb970","#e7d3b0"],["#85a29e","#ffebbf","#f0d442","#f59330","#b22148"],["#15212a","#99c9bd","#d7b89c","#feab8d","#f4c9a3"],["#fe6c2b","#d43b2d","#9f102c","#340016","#020001"],["#f88f89","#eec276","#fbf6d0","#79c3aa","#1f0e1a"],["#ffffff","#a1c1be","#59554e","#f3f4e5","#e2e3d9"],["#ccded2","#fffbd4","#f5ddbb","#e3b8b2","#a18093"],["#79a687","#718063","#67594d","#4f2b38","#1d1016"],["#45aab8","#e1d772","#faf4b1","#394240","#f06b50"],["#e6e1cd","#c6d8c0","#d6b3b1","#f97992","#231b42"],["#69d0b3","#9bdab3","#b4dfb3","#cde4b3","#d9cf85"],["#332c26","#db1414","#e8591c","#7fb8b0","#c5e65c"],["#75372d","#928854","#96a782","#d4ce9e","#d8523d"],["#d1b68d","#87555c","#492d49","#51445f","#5a5c75"],["#8e407a","#fe6962","#f9ba84","#eee097","#ffffe5"],["#ffe4aa","#fca699","#e2869b","#c9729f","#583b7e"],["#9e1e4c","#ff1168","#25020f","#8f8f8f","#ececec"],["#272d4d","#b83564","#ff6a5a","#ffb350","#83b8aa"],["#b5f4bc","#fff19e","#ffdc8a","#ffba6b","#ff6543"],["#539fa2","#72b1a4","#abccb1","#c4dbb4","#d4e2b6"],["#80d3bb","#bafdc2","#e5f3ba","#5c493d","#3a352f"],["#5adb94","#0ba18c","#368986","#8a034d","#2e0331"],["#101942","#80043a","#f60c49","#f09580","#fdf2b4"],["#c9b849","#c96823","#be3100","#6f0b00","#241714"],["#ff4746","#e8da5e","#92b55f","#487d76","#4b4452"],["#a8bcbd","#fcdcb3","#f88d87","#d65981","#823772"],["#002e34","#004443","#00755c","#00c16c","#90ff17"],["#1f0a1d","#334f53","#45936c","#9acc77","#e5ead4"],["#444444","#fcf7d1","#a9a17a","#b52c00","#8c0005"],["#0fc3e8","#0194be","#e2d397","#f07e13","#481800"],["#d8d8d8","#e2d9d8","#ecdad8","#f5dbd8","#ffdcd8"],["#4b538b","#15191d","#f7a21b","#e45635","#d60257"],["#c4ddd6","#d4ddd6","#e4ddd6","#e4e3cd","#ececdd"],["#4d4a4b","#f60069","#ff41a1","#ff90ab","#ffccd1"],["#899aa1","#bda2a2","#fbbe9a","#fad889","#faf5c8"],["#000000","#ff8830","#d1b8a0","#aeced2","#cbdcdf"],["#36173d","#ff4845","#ff745f","#ffc55f","#ffec5e"],["#f8f8ec","#aedd2b","#066699","#0a5483","#02416d"],["#184848","#006060","#007878","#a8c030","#f0f0d8"],["#706767","#e87474","#e6a37a","#d9c777","#c0dbab"],["#dacdbd","#f2b8a0","#ef97a3","#df5c7e","#d4486f"],["#170132","#361542","#573e54","#85ae72","#bce1ab"],["#e9dfcc","#f3a36b","#cd5b51","#554865","#352630"],["#db5643","#1c0f0e","#70aa87","#9fb38f","#c5bd99"],["#c8d197","#d89845","#c54b2c","#473430","#11baac"],["#aab69b","#9e906e","#9684a3","#8870ff","#000000"],["#000706","#00272d","#134647","#0c7e7e","#bfac8b"],["#f1ecdf","#d4c9ad","#c7ba99","#000000","#f58723"],["#565175","#538a95","#67b79e","#ffb727","#e4491c"],["#fcfdeb","#e3cebd","#c1a2a0","#725b75","#322030"],["#d7e8d5","#e6f0af","#e8ed76","#ffcd57","#4a3a47"],["#288d85","#b9d9b4","#d18e8f","#b05574","#f0a991"],["#260729","#2a2344","#495168","#ccbd9e","#d8ccb2"],["#aef055","#e0ffc3","#25e4bc","#3f8978","#514442"],["#affbff","#d2fdfe","#fefac2","#febf97","#fe6960"],["#f7f799","#e0d124","#f0823f","#bd374c","#443a37"],["#dbda97","#efae54","#ef6771","#4b1d37","#977e77"],["#c8ce13","#f8f5c1","#349e97","#2c0d1a","#de1a72"],["#b9113f","#a8636e","#97b59d","#cfcca8","#ffe3b3"],["#ed7b83","#ec8a90","#eba2a4","#e6d1ca","#eee9c7"],["#002930","#ffffff","#f8f0af","#ac4a00","#000000"],["#913f33","#ff705f","#ffaa67","#ffdfab","#9fb9c2"],["#edeccf","#f1c694","#dc6378","#207178","#101652"],["#fee9a6","#fec0ab","#fa5894","#660860","#9380b7"],["#d3c8b4","#d4f1db","#eecab1","#fe6c63","#240910"],["#edd58f","#c2bf92","#66ac92","#686077","#641f5e"],["#e04891","#e1b7ed","#f5e1e2","#d1e389","#b9de51"],["#43777a","#442432","#c02948","#d95b45","#ecd079"],["#4180ab","#ffffff","#8ab3cf","#bdd1de","#e4ebf0"],["#f9d423","#ede574","#e1f5c4","#add6bc","#79b7b4"],["#f4f8e6","#f2e9e6","#4a3d3d","#ff6161","#d8dec3"],["#f9f6ec","#88a1a8","#502940","#790614","#0d0c0c"],["#ffab03","#fc7f03","#fc3903","#d1024e","#a6026c"],["#50232e","#f77c3e","#faba66","#fce185","#a2cca5"],["#f9ebf2","#f3e2e8","#fcd7da","#f58f9a","#3c363b"],["#ffffff","#a1ac88","#757575","#464d70","#000000"],["#736558","#fd65a0","#fef5c6","#aaf2e4","#31d5de"],["#f7f6e4","#e2d5c1","#5f3711","#f6f6e2","#d4c098"],["#95de90","#cef781","#f7c081","#ff7857","#6b6b6b"],["#f2502c","#cad17a","#fcf59b","#91c494","#c42311"],["#b2d9f7","#487aa1","#3d3c3b","#7c8071","#dde3ca"],["#f7dece","#eed7c5","#ccccbb","#9ec4bb","#2d2e2c"],["#e3ba6a","#bfa374","#6d756a","#4d686f","#364461"],["#686466","#839cb5","#96d7eb","#b1e1e9","#f2e4f9"],["#f7f1e1","#ffdbd7","#ffb2c1","#ce7095","#855e6e"],["#2e1e45","#612a52","#ba3259","#ff695c","#ccbca1"],["#8dc9b5","#f6f4c2","#ffc391","#ff695c","#8c315d"],["#0db2ac","#f5dd7e","#fc8d4d","#fc694d","#faba32"],["#fffab3","#a2e5d2","#63b397","#9dab34","#2c2321"],["#ebf2f2","#d0f2e7","#bcebdf","#ade0db","#d9dbdb"],["#e4e6c3","#88baa3","#ba1e4a","#63203d","#361f2d"],["#204b5e","#426b65","#baab6a","#fbea80","#fdfac7"],["#dadad8","#fe6196","#ff2c69","#1ea49d","#cbe65b"],["#910142","#6c043c","#210123","#fef7d5","#0ec0c1"],["#ab505e","#d9a071","#cfc88f","#a5b090","#607873"],["#43204a","#7f1e47","#422343","#c22047","#ea284b"],["#482c21","#a73e2b","#d07e0e","#e9deb0","#2f615e"],["#042608","#2a5c0b","#808f12","#faedd9","#ea2a15"],["#ff275e","#e6bc56","#7f440a","#6a9277","#f8d9bd"],["#3f324d","#93c2b1","#ffeacc","#ff995e","#de1d6a"],["#ffc2ce","#80b3ff","#fd6e8a","#a2122f","#693726"],["#f3d915","#e9e4bb","#bfd4b7","#a89907","#1a1c27"],["#9c8680","#eb5e7f","#f98f6f","#dbbf6b","#c8eb6a"],["#917f6e","#efbc98","#efd2be","#efe1d1","#d9ddcd"],["#c72546","#66424c","#768a4f","#b3c262","#d5ca98"],["#e6e8e3","#d7dacf","#bec3bc","#8f9a9c","#65727a"],["#2f3559","#9a5071","#e394a7","#f1bbbb","#e6d8cb"],["#63594d","#b18272","#c2b291","#d6e4c3","#eae3d1"],["#e8de92","#810e0b","#febea3","#fce5b1","#f6f5da"],["#f8f69f","#bab986","#7c7b6c","#3e3e53","#000039"],["#c3dfd7","#c8dfd2","#cddfcd","#d2dfc8","#d7dfc3"],["#172c3c","#274862","#995052","#d96831","#e6b33d"],["#678d6c","#fc7d23","#fa3c08","#bd0a41","#772a53"],["#dae2cb","#96c3a6","#6cb6a5","#221d34","#90425c"],["#8c0e48","#80ab99","#e8dbad","#b39e58","#99822d"],["#dbf73b","#c0cc39","#eb0258","#a6033f","#2b2628"],["#f1ebeb","#eee8e8","#cacaca","#24c0eb","#5cceee"],["#454545","#743455","#a22365","#d11174","#ff0084"],["#796c86","#74aa9b","#91c68d","#ece488","#f6f5cd"],["#7375a5","#21a3a3","#13c8b5","#6cf3d5","#2b364a"],["#efac41","#de8531","#b32900","#6c1305","#330a04"],["#fffbf0","#968f4b","#7a6248","#ab9597","#030506"],["#31827c","#95c68f","#f7e9aa","#fc8a80","#fd4e6d"],["#615050","#776a6a","#ad9a6f","#f5f1e8","#fcfcfc"],["#f26b7a","#f0f2dc","#d9eb52","#8ac7de","#87796f"],["#b877a8","#b8008a","#ff3366","#ffcc33","#ccff33"],["#b9340b","#cea45c","#c5be8b","#498379","#3f261c"],["#f4e196","#a6bf91","#5f9982","#78576b","#400428"],["#72bca5","#f4ddb4","#f1ae2b","#bc0b27","#4a2512"],["#ddcaa2","#aebea3","#b97479","#d83957","#4e5c69"],["#141827","#62455b","#736681","#c1d9d0","#fffae3"],["#2b9eb3","#85cc9c","#bcd9a0","#edf79e","#fafad7"],["#cfb698","#ff5d57","#dd0b64","#6f0550","#401c2a"],["#a8c078","#a89048","#a84818","#61290e","#330c0c"],["#171133","#581e44","#c5485a","#d4be99","#e0ffcc"],["#ebe5b2","#f6f3c2","#f7c69f","#f89b7e","#b5a28b"],["#ff0f35","#f86254","#fea189","#f3d5a5","#bab997"],["#20130a","#142026","#123142","#3b657a","#e9f0c9"],["#bdbf90","#35352b","#e7e9c4","#ec6c2b","#feae4b"],["#eeccbb","#f1731f","#e03e36","#bd0d59","#730662"],["#ffcfad","#ffe4b8","#e6d1b1","#b8aa95","#5e5a54"],["#ff9934","#ffc018","#f8fef4","#cde54e","#b3c631"],["#d1dbc8","#b8c2a0","#c97c7a","#da3754","#1f1106"],["#bda0a2","#ffe6db","#d1eaee","#cbc8b5","#efb0a9"],["#4d433d","#525c5a","#56877d","#8ccc81","#bade57"],["#262525","#525252","#e6ddbc","#822626","#690202"],["#9d9f89","#84af97","#8bc59b","#b2de93","#ccee8d"],["#52423c","#ad5c70","#d3ad98","#edd4be","#b9c3c4"],["#353437","#53576b","#7a7b7c","#a39b7e","#e2c99f"],["#a22c27","#4f2621","#9f8241","#ebd592","#929867"],["#839074","#939e78","#a8a878","#061013","#cdcd76"],["#eb9d8d","#93865a","#a8bb9a","#c5cba6","#efd8a9"],["#6a3d5a","#66666e","#6d8d76","#b0c65a","#ebf74f"],["#ff9966","#d99973","#b39980","#8c998c","#669999"],["#d1dab9","#92bea5","#6f646c","#671045","#31233e"],["#f9ded3","#fdd1b6","#fab4b6","#c7b6be","#89abb4"],["#4b4b55","#f4324a","#ff516c","#fb9c5a","#fcc755"],["#820081","#fe59c2","#fe40b9","#fe1cac","#390039"],["#000000","#ed0b65","#b2a700","#fcae11","#770493"],["#941f1f","#ce6b5d","#ffefb9","#7b9971","#34502b"],["#482344","#2b5166","#429867","#fab243","#e02130"],["#031c30","#5a3546","#b5485f","#fc6747","#fa8d3b"],["#a9b79e","#e8ddbd","#dba887","#c25848","#9d1d36"],["#666666","#abdb25","#999999","#ffffff","#cccccc"],["#27081d","#47232c","#66997b","#a4ca8b","#d2e7aa"],["#8fc9b9","#d8d9c0","#d18e8f","#ab5c72","#91334f"],["#8ba6ac","#d7d7b8","#e5e6c9","#f8f8ec","#bdcdd0"],["#ffe7bf","#ffc978","#c9c987","#d1a664","#c27b57"],["#0c0636","#095169","#059b9a","#53ba83","#9fd86b"],["#f3dcb2","#facb97","#f59982","#ed616f","#f2116c"],["#ff3366","#e64066","#cc4d66","#b35966","#996666"],["#fdf4b0","#a4dcb9","#5bcebf","#32b9be","#2e97b7"],["#302727","#ba2d2d","#f2511b","#f2861b","#c7c730"],["#fdbf5c","#f69a0b","#d43a00","#9b0800","#1d2440"],["#dfd0af","#e8acac","#a45785","#85586c","#a1c0a1"],["#f3214e","#cf023b","#000000","#f4a854","#fff8bc"],["#ec4b59","#9a2848","#130716","#fc8c77","#f8dfbd"],["#1f0b0c","#e7fccf","#d6c396","#b3544f","#300511"],["#6e9167","#ffdd8c","#ff8030","#cc4e00","#700808"],["#332e1d","#5ac7aa","#9adcb9","#fafcd3","#efeba9"],["#adeada","#bdeadb","#cdeadc","#ddeadd","#edeade"],["#ffad08","#edd75a","#73b06f","#0c8f8f","#405059"],["#295264","#fad9a6","#bd2f28","#89373d","#142433"],["#331436","#7a1745","#cb4f57","#eb9961","#fcf4b6"],["#fef0a5","#f8d28b","#e3b18b","#a78d9e","#74819d"],["#f7ead9","#e1d2a9","#88b499","#619885","#67594e"],["#210518","#3d1c33","#5e4b55","#7c917f","#93bd9a"],["#ecf8d4","#e0deab","#cb8e5f","#85685a","#0d0502"]];
},{}],"src/movie-bg.js":[function(require,module,exports) {
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("canvas-sketch-util/math"),
    lerp = _require.lerp;

var random = require('canvas-sketch-util/random');

var palettes = require('nice-color-palettes/500.json');

var canvas = document.getElementById("canva-art");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var ctx = canvas.getContext('2d');
var canvas2 = document.getElementById("canva-art2");
canvas2.width = canvas2.clientWidth;
canvas2.height = canvas2.clientHeight;
var ctx2 = canvas2.getContext('2d');
var palette = random.shuffle(random.pick(palettes)).slice(0, 5);
document.querySelector('.heading').style.color = palette[1];
$(".btn").css("backgroundColor", "black");
$(".btn").css("color", 'white');
$(".btn").css("border", "1px solid black");

var createGrid = function createGrid(counter) {
  var points = [];
  var count = counter;

  for (var i = 0; i < count; i++) {
    for (var j = 0; j < count; j++) {
      var u = count <= 1 ? 0.5 : i / (count - 1);
      var v = count <= 1 ? 0.5 : j / (count - 1);
      points.push({
        position: [u, v],
        color: random.pick(palette)
      });
    }
  }

  return points;
};

var points = createGrid(5);
var margin = 30;
var width = canvas.offsetWidth;
var height = canvas.offsetHeight;
console.log(width, height);
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);
points.forEach(function (data) {
  var position = data.position,
      color = data.color;

  var _position = _slicedToArray(position, 2),
      u = _position[0],
      v = _position[1];

  var x = lerp(margin, width - margin, u);
  var y = lerp(margin, height - margin, v);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(random.range(margin, width - margin), random.range(margin, height - margin));
  ctx.lineTo(random.range(margin, width - margin), random.range(margin, height - margin)); //ctx.arc(x, y, Math.abs(random.gaussian())*width/10, 0, Math.PI*random.range(1,2), false)

  ctx.fillStyle = color;
  ctx.fill();
});
var points2 = createGrid(30);
var margin2 = 50;
var width2 = canvas2.offsetWidth;
var height2 = canvas2.offsetHeight;
console.log(width2, height2);
ctx2.globalAlpha = 0.5;
points2.forEach(function (data2) {
  var position2 = data2.position;
  var color2 = data2.color;

  var _position2 = _slicedToArray(position2, 2),
      u2 = _position2[0],
      v2 = _position2[1];

  var x2 = lerp(margin2, width2 - margin2, u2);
  var y2 = lerp(margin2, height2 - margin2, v2);

  if (random.chance(0.75)) {
    ctx2.beginPath();
    ctx2.arc(x2, y2, random.range(10, 200), 0, Math.PI * 2);
    ctx2.fillStyle = color2;
    ctx2.fill();
  }
});
},{"canvas-sketch-util/math":"node_modules/canvas-sketch-util/math.js","canvas-sketch-util/random":"node_modules/canvas-sketch-util/random.js","nice-color-palettes/500.json":"node_modules/nice-color-palettes/500.json"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60481" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/movie-bg.js"], null)
//# sourceMappingURL=/movie-bg.f519c977.js.map