import { alt, lazy, optWhitespace, Parser, seq, string } from 'parsimmon';

const _ = optWhitespace;

type OperatorRecord = {
	[key: string]: string;
};

function createOperator(operators: OperatorRecord) {
	const keys = Object.keys(operators).sort();
	const parser = keys.map((k) => string(operators[k]).trim(_).result(k));
	return alt(...parser);
}

function PREFIX(operatorsParser: any, nextParser: Parser<never>) {
	const parser: Parser<never> = lazy(() => {
		return seq(operatorsParser, parser).or(nextParser);
	});
	return parser;
}
