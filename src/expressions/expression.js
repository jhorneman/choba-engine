import isEqual from 'lodash/isEqual';
import { isValidValue, nullValue, convertValueToText } from '../types';


export function evaluateExpression(_expression, _dynamicState, _context) {
    if (Array.isArray(_expression)) {
        if (_expression.length > 0) {
            const operator = _expression[0];
            if (_context.expressionEvaluators.hasOwnProperty(operator)) {
                const returnValue = _context.expressionEvaluators[operator](_expression.slice(1), _dynamicState, _context);
                if (isValidValue(returnValue, _context.reportError)) {
                    return returnValue;
                } else {
                   _context.reportError('Operator \'' + operator + '\' returned an invalid value.');
                }
            } else {
                _context.reportError('Unknown operator \'' + operator + '\'.');
            }
        }
    } else {
        _context.reportError('Expected an array as the expression, got ' + typeof(_expression) + '.');
    }

    return nullValue;
}

export function evaluateArrayOfScenePartExpressions(_expressions, _dynamicState, _context) {
    let texts = [],
        options = [],
        dynamicState = Object.assign({}, _dynamicState);

    for (let i=0; i<_expressions.length; i++) {
        const value = evaluateExpression(_expressions[i], dynamicState, _context);
        switch (value.type) {
            case 'scenePart': {
                if (value.value.hasOwnProperty('dynamicState')) { dynamicState = value.value['dynamicState']; }
                if (value.value.hasOwnProperty('text')) { texts.push(value.value['text']); }
                if (value.value.hasOwnProperty('options')) { options = options.concat(value.value['options']); }
                break;
            }
            case 'options': {
                options = options.concat(value.value);
                break;
            }
            case 'dynamicState': {
                dynamicState = value.value;
                break;
            }
            default: {
                const text = convertValueToText(value, _context.reportError);
                if (text.length > 0) {
                    texts.push(text);
                }
            }
        }
    }

    let returnValue = {
        type: 'scenePart',
        value: {}
    };
    if (texts.length > 0) { returnValue.value['text'] = texts.join(''); }
    if (options.length > 0) { returnValue.value['options'] = [].concat.apply([], options); }
    if (!isEqual(dynamicState, _dynamicState)) { returnValue.value['dynamicState'] = dynamicState; }
    return returnValue;
}

export function evaluateExpressionThatResultsInText(_expression, _dynamicState, _context) {
    const value = evaluateExpression(_expression, _dynamicState, _context);
    return convertValueToText(value, _context.reportError);
}
