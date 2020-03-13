const mlib = require('mathjs');
const mathjs = mlib.create(mlib.all);

/* Rewrite a recurance's initial conditions in iff form  */
const get_rec_def = function (recurance, conditions) {
  const fn = mathjs.parse(recurance);
  const name = fn.name;
  const param = fn.params[0];  // TODO: support mulitvariable recurances
  const expr = fn.expr;

  const [fc, f_c] = mathjs.parse(conditions.split('='));  // f(c)
  const c = fc.args[0];

  // Eg. f     (    n    ) = iff(    n    ,     n    >=  1  , "f(n/2)+1",    0   )
  return name+'('+param+') = iff('+param+', '+param+'>='+c+', "'+expr+'", '+f_c+')';
};

/* Pre-parse an expression string */
const preparse = function (expression) {
  const rec_def = /* to do */ false;
  if (rec_def) {
    expression = get_rec_def(expression);
  }

  return expression;
};

/* Memoized ternary if else */
var mem = {};
const iff = function (args, _, scope) {
  const memotag = args.map(String).join('')+JSON.stringify(scope);
  let memo = mem[memotag];
  if (memo === undefined) {
    const [above_base_case, f, base_val] = args;

    // iff base condition not met, recurse, else, stop
    memo = above_base_case.evaluate(scope) ? f.evaluate(scope) : base_val.evaluate(scope);

    mem[memotag] = memo;
  }
  return memo;
}; iff.rawArgs = true;

mathjs.import({'iff': iff});  // Load the lazily evaluated definition

/* Create custom math.js parser */
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
