# Parser Combinator Math

An arithmetic parser built with parser combinators in typescipt, based on [Parsimmon](https://github.com/jneen/parsimmon). This project is based on the [math example](https://github.com/jneen/parsimmon/blob/master/examples/math.js) in Parsimmon's repository.

This library converts basic arithmetic equations into an AST. Refer to [Grammar](#grammar) for the supported syntax.

Note: This library does not evaluate arithmetic expressions. It only converts a string into a well-typed AST representation.

## Usage

### Installation

```sh
yarn add @ticklepoke/parser-combinator-math
```

### Creating an AST

```js
import { MathParser } from '@ticklepoke/parser-combinator-math';

const ast = MathParser.tryParse('1+1');
```

## Background

Parser combinators are complex parsers that are built from simpler, base parsers. Each base parser is responsible for parsing a subset of the language. The base parsers can then be combined in various effectful ways to capture the semantics of the language to be parsed.

Parser combinators can be viewed as the "informal, less academic" cousin of LL(n), LR(n), LALR(n) parsers due to their flexibility of usage.

## Grammar

```txt
BinaryOperator ::= + | - | * | / | ^
Expression ::= UnaryExpression | BinaryExpression | Number
GroupedExpression ::= ( Expression )
UnaryExpression ::= - GroupedExpression | GroupedExpression !
BinaryExpression ::= GroupedExpression BinaryOperator GroupedExpression

```

## AST Nodes

```ts
type Number = {
    type: 'Number',
    value: number
}

type UnaryExpression = {
    type: 'UnaryExpression',
    operator: string,
    argument: Expression
}

type BinaryExpression = {
    type: 'BinaryExpression',
    operator: string,
    argument: Expression
}

type Expression = Number | UnaryExpression | BinaryExpression
```
