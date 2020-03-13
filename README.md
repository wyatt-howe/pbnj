# pbnj - Parse by name javascript
Custom math.js parsing to support evaluating recursive equations safely and efficiently.


### Install
```shell
npm add https://github.com/wyatt-howe/pbnj
```

### Use

```javascript
const pbnj = require('pbnj');
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
```

```javascript
{
  iff: [Function: iff] { rawArgs: true },
  b: 0,
  c: 1,
  d: 2,
  T: [Function: T] {
    signatures: { any: [Function (anonymous)] },
    syntax: 'T(n)'
  },
  V: [Function: V] {
    signatures: { any: [Function (anonymous)] },
    syntax: 'V(n)'
  }
}
3 [ 11, 5 ]
```
