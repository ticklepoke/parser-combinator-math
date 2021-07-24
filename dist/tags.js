"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tagBinary = exports.tagUnary = exports.tagNumber = void 0;

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
var tagNumber = function tagNumber(value) {
  return {
    type: 'Number',
    value: value
  };
};

exports.tagNumber = tagNumber;

var tagUnary = function tagUnary(operator) {
  return function (argument) {
    return {
      type: 'UnaryExpression',
      operator: operator,
      argument: argument
    };
  };
};

exports.tagUnary = tagUnary;

var tagBinary = function tagBinary(left) {
  return function (operator) {
    return function (right) {
      return {
        type: 'BinaryExpression',
        operator: operator,
        left: left,
        right: right
      };
    };
  };
};

exports.tagBinary = tagBinary;