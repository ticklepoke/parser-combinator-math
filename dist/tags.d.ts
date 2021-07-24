export declare const tagNumber: <V>(value: V) => {
    type: string;
    value: V;
};
export declare const tagUnary: (operator: string) => <A>(argument: A) => {
    type: string;
    operator: string;
    argument: A;
};
export declare const tagBinary: <L>(left: L) => (operator: string) => <R>(right: R) => {
    type: string;
    operator: string;
    left: L;
    right: R;
};
