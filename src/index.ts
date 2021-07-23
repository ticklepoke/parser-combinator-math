import P from 'parsimmon';
import util from 'util';
import { head, tail } from './arrayUtils';
import { tagUnary, tagBinary, tagNumber } from './tags';

const _ = P.optWhitespace;

// Returns a parser that parses a prefix: -(-1)
const prefixParserFactory = <A, B>(operatorsParser: P.Parser<A>, nextParser: P.Parser<B>) =>
	P.seqMap(operatorsParser.many(), nextParser, (operators, b) =>
		operators.reduce((subtree, a) => tagUnary(String(a))(subtree) as never, b)
	);

// Returns a parser that parses a post fix: 1!!!
const postfixParserFactory = <A, B>(operatorsParser: P.Parser<A>, nextParser: P.Parser<B>) =>
	P.seqMap(nextParser, operatorsParser.many(), (a, operators) =>
		operators.reduce((subtree, b) => tagUnary(String(b))(subtree) as never, a)
	);

// Groups operators from right to left (only exponents for now): 1^2^3 -> 1^(2^3)
const binaryRightParserFactory = <T>(operatorsParser: P.Parser<string>, nextParser: P.Parser<T>) =>
	P.seqMap(P.seq(nextParser, operatorsParser).many(), nextParser, (firsts, last) =>
		firsts.reduce((acc, curr) => tagBinary(head(curr))(tail(curr))(acc) as never, last)
	);

const binaryLeftParserFactory = <T>(operatorsParser: P.Parser<string>, nextParser: P.Parser<T>) =>
	P.seqMap(nextParser, P.seq(operatorsParser, nextParser).many(), (first, rest) =>
		rest.reduce((acc, curr) => tagBinary(tail(curr))(head(curr))(acc) as never, first)
	);

type OperatorSpec = {
	[key: string]: string;
};
// Takes an operator spec: { Add: "+" } and creates an operator parser
// Also strips optional whitespace around the operator
function operatorParserFactory(OpSpec: OperatorSpec) {
	const keys = Object.keys(OpSpec).sort();
	const parsers = keys.map((k) => P.string(OpSpec[k]).trim(_));
	return P.alt(...parsers);
}

// Tags a number as a valid AST node
const NumberParser = P.regexp(/[0-9]+/)
	.map(Number)
	.map(tagNumber);

// Recursively parses bracket expressions until we reach a number
const ExpressionParser: P.Parser<unknown> = P.lazy(() =>
	P.string('(').then(MathParser).skip(P.string(')')).or(NumberParser)
);

const operators = [
	{ factory: prefixParserFactory, operators: operatorParserFactory({ Negate: '-' }) },
	{ factory: postfixParserFactory, operators: operatorParserFactory({ Factorial: '!' }) },
	{ factory: binaryRightParserFactory, operators: operatorParserFactory({ Exponent: '^' }) },
	{ factory: binaryLeftParserFactory, operators: operatorParserFactory({ Add: '+', Subtract: '-' }) },
	{ factory: binaryLeftParserFactory, operators: operatorParserFactory({ Multiply: '*', Divide: '/' }) },
];

export const MathParser = operators
	.reduce((ps, { factory, operators: operator }) => factory(operator, ps), ExpressionParser)
	.trim(_);

// const res = NumberParser.tryParse('a120');
const res = MathParser.tryParse('-(1-2-3 * 8)');

function prettyPrint(ast: unknown) {
	const formatted = util.inspect(ast, undefined, null, true);
	console.log(formatted);
}

prettyPrint(res);
