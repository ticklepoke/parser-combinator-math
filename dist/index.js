"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MathParser = void 0;

var _parsimmon = _interopRequireDefault(require("parsimmon"));

var _util = _interopRequireDefault(require("util"));

var _arrayUtils = require("./arrayUtils");

var _tags = require("./tags");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _ = _parsimmon["default"].optWhitespace; // Returns a parser that parses a prefix: -(-1)

var prefixParserFactory = function prefixParserFactory(operatorsParser, nextParser) {
  return _parsimmon["default"].seqMap(operatorsParser.many(), nextParser, function (operators, b) {
    return operators.reduce(function (subtree, a) {
      return (0, _tags.tagUnary)(String(a))(subtree);
    }, b);
  });
}; // Returns a parser that parses a post fix: 1!!!


var postfixParserFactory = function postfixParserFactory(operatorsParser, nextParser) {
  return _parsimmon["default"].seqMap(nextParser, operatorsParser.many(), function (a, operators) {
    return operators.reduce(function (subtree, b) {
      return (0, _tags.tagUnary)(String(b))(subtree);
    }, a);
  });
}; // Groups operators from right to left (only exponents for now): 1^2^3 -> 1^(2^3)


var binaryRightParserFactory = function binaryRightParserFactory(operatorsParser, nextParser) {
  return _parsimmon["default"].seqMap(_parsimmon["default"].seq(nextParser, operatorsParser).many(), nextParser, function (firsts, last) {
    return firsts.reduce(function (acc, curr) {
      return (0, _tags.tagBinary)((0, _arrayUtils.head)(curr))((0, _arrayUtils.tail)(curr))(acc);
    }, last);
  });
};

var binaryLeftParserFactory = function binaryLeftParserFactory(operatorsParser, nextParser) {
  return _parsimmon["default"].seqMap(nextParser, _parsimmon["default"].seq(operatorsParser, nextParser).many(), function (first, rest) {
    return rest.reduce(function (acc, curr) {
      return (0, _tags.tagBinary)((0, _arrayUtils.tail)(curr))((0, _arrayUtils.head)(curr))(acc);
    }, first);
  });
};

// Takes an operator spec: { Add: "+" } and creates an operator parser
// Also strips optional whitespace around the operator
function operatorParserFactory(OpSpec) {
  var keys = Object.keys(OpSpec).sort();
  var parsers = keys.map(function (k) {
    return _parsimmon["default"].string(OpSpec[k]).trim(_);
  });
  return _parsimmon["default"].alt.apply(_parsimmon["default"], _toConsumableArray(parsers));
} // Tags a number as a valid AST node


var NumberParser = _parsimmon["default"].regexp(/[0-9]+/).map(Number).map(_tags.tagNumber); // Recursively parses bracket expressions until we reach a number


var ExpressionParser = _parsimmon["default"].lazy(function () {
  return _parsimmon["default"].string('(').then(MathParser).skip(_parsimmon["default"].string(')')).or(NumberParser);
});

var operators = [{
  factory: prefixParserFactory,
  operators: operatorParserFactory({
    Negate: '-'
  })
}, {
  factory: postfixParserFactory,
  operators: operatorParserFactory({
    Factorial: '!'
  })
}, {
  factory: binaryRightParserFactory,
  operators: operatorParserFactory({
    Exponent: '^'
  })
}, {
  factory: binaryLeftParserFactory,
  operators: operatorParserFactory({
    Add: '+',
    Subtract: '-'
  })
}, {
  factory: binaryLeftParserFactory,
  operators: operatorParserFactory({
    Multiply: '*',
    Divide: '/'
  })
}];
var MathParser = operators.reduce(function (ps, _ref) {
  var factory = _ref.factory,
      operator = _ref.operators;
  return factory(operator, ps);
}, ExpressionParser).trim(_); // const res = NumberParser.tryParse('a120');

exports.MathParser = MathParser;
var res = MathParser.tryParse('-(1-2-3 * 8)');

function prettyPrint(ast) {
  var formatted = _util["default"].inspect(ast, undefined, null, true);

  console.log(formatted);
}

prettyPrint(res);