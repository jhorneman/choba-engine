import { evaluateSeqExpression,
         evaluateTextExpression,
         evaluateIfExpression,
         evaluateOneOfExpression,
         evaluateLiteralExpression,
         evaluateNullExpression,
         evaluateRandomPercentageExpression } from './expressions.js';
import { evaluateAddOptionExpression } from './addOptionExpression.js';
import { evaluateEqExpression,
         evaluateGtExpression,
         evaluateLtExpression,
         evaluateGtEqExpression,
         evaluateLtEqExpression,
         evaluateOrExpression,
         evaluateAndExpression } from './logicalExpressions.js';
import { evaluateInjectOptionExpression,
         evaluateInjectBlockExpression } from './tagBasedExpressions.js';
import { evaluateVarExpression,
         evaluateSetExpression } from './variableExpressions.js';
import { evaluateAddExpression,
         evaluateSubtractExpression } from './arithmeticalExpressions.js';


export const expressionEvaluators = {
    'seq': evaluateSeqExpression,
    'text': evaluateTextExpression,

    'addOption': evaluateAddOptionExpression,

    'injectOption': evaluateInjectOptionExpression,
    'injectBlock': evaluateInjectBlockExpression,
    'if': evaluateIfExpression,
    'oneOf': evaluateOneOfExpression,

    'eq': evaluateEqExpression,
    'gt': evaluateGtExpression,
    'lt': evaluateLtExpression,
    'gteq': evaluateGtEqExpression,
    'lteq': evaluateLtEqExpression,

    'or': evaluateOrExpression,
    'and': evaluateAndExpression,

    'set': evaluateSetExpression,
    'var': evaluateVarExpression,

    'add': evaluateAddExpression,
    'subtract': evaluateSubtractExpression,

    'literal': evaluateLiteralExpression,
    'null': evaluateNullExpression,
    'randomPercentage': evaluateRandomPercentageExpression
};
