const mlib = require('mathjs');
const mathjs = mlib.create(mlib.all)

const preparse = function (expression) {
  // console.log('preparse', expression);
  // const fn = mathjs.parse(recurance);
  // const name = fn.name;
  // const params = fn.params;
  // const expr = fn.expr;
  //
  // let [fc, f_c] = mathjs.parse(conditions.split('='));  // f(c)
  // let c = fc.args[0];

  return expression;
};

const iff = function (args, _, scope) {
  const above_base_case = args[0];
  const f = args[1];
  const base_val = args[2];

  return above_base_case.evaluate(scope) ? f.evaluate(scope) : base_val.evaluate(scope);
}; iff.rawArgs = true;

mathjs.import({'iff': iff})

const Parser = function (context) {
  const parser = mathjs.parser();

  if (context != null) {
    parser.scope = context;
  }

  parser.set('iff', iff);

  parser.parse = function () {
    return parser.evaluate(preparse.apply(this, arguments));
  }.bind(this);

  return parser;
}

/* Expand context */
const parse = function (definitions, context) {
  const parser = Parser(context);

  if (Array.isArray(definitions) === false) {
    parser.parse(definitions);
  } else {
    definitions.forEach(function (def) {
      parser.parse(def);
    });
  }

  return parser.getAll();
}

/* Evaluate expression in context */
const wrap_evaluate = function (expression, context) {
  const parser = Parser(context);

  let value;
  if (Array.isArray(expression) === false) {
    value = parser.evaluate(expression);
  } else {
    value = expression.map(e => parser.evaluate(e));
  }

  return value;
}

module.exports = {
  parse: parse,
  evaluate: wrap_evaluate
}
