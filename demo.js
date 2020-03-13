const CURRENT_DIR = '/path/to/pbnj/parent/directory/';
const pbnj = require(CURRENT_DIR+'pbnj');
const parse = pbnj.parse;
const evaluate = pbnj.evaluate;

const constants = 'b = 0; c = 1; d = 2';
const T = 'T(n) = iff(n>c, T(n/d)+c, b)';
const V = 'V(n) = iff(n>b, V(n-c)+d, c)';

let context = {};
context = parse(constants);
context = parse([T, V], context);

console.log(context);

let value = evaluate('T(8)', context);
let values = evaluate(['V(5)', 'V(2)'], context);

console.log(value, values);
