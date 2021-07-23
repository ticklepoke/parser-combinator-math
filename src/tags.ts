/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const tagNumber = <V>(value: V) => ({
	type: 'Number',
	value,
});

export const tagUnary =
	(operator: string) =>
	<A>(argument: A) => ({
		type: 'UnaryExpression',
		operator,
		argument,
	});

export const tagBinary =
	<L>(left: L) =>
	(operator: string) =>
	<R>(right: R) => ({
		type: 'BinaryExpression',
		operator,
		left,
		right,
	});
