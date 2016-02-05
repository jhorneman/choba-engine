import { nullValue, isTrueValue, isNullValue } from '../types';
import { evaluateExpression } from './expression.js';


const trueValue = {
    type: 'boolean',
    value: true
};

const falseValue = {
    type: 'boolean',
    value: false
};


function parameterToNiceString(_parameter) {
    if (Array.isArray(_parameter)) {
        switch (_parameter[0]) {
            case 'var': {
                return 'variable ' + _parameter[1];
            }
            case 'literal': {
                return 'literal ' + _parameter[1].value;
            }
        }
    }
    return _parameter;
}


function evaluateCompareExpression(_parameters, _dynamicState, _context, _operatorName, _operatorFn) {
    if (_parameters.length !== 2) {
        _context.reportError(_operatorName + ' has ' + _parameters.length + ' parameters, 2 were expected.');
        return nullValue;
    }

    const lValue = evaluateExpression(_parameters[0], _dynamicState, _context);
    const rValue = evaluateExpression(_parameters[1], _dynamicState, _context);

    let result = false;
    if (isNullValue(lValue)) {
        _context.reportError(_operatorName + ': ' + parameterToNiceString(_parameters[0]) + ' evaluated to null.');
    } else {
        if (isNullValue(rValue)) {
            _context.reportError(_operatorName + ': ' + parameterToNiceString(_parameters[1]) + ' evaluated to null.');
        } else {
            if (lValue.type !== rValue.type) {
                _context.reportError(_operatorName + ': Type mismatch. ' + parameterToNiceString(_parameters[0]) + ' has type ' + lValue.type + ' while ' + parameterToNiceString(_parameters[1]) + ' has type ' + rValue.type + '.');
            } else {
                if ((_operatorName !== 'Eq') && (lValue.type !== 'integer')) {
                    _context.reportError(_operatorName + ': It\s only possible to do relative comparisons with integers, not with values of type ' + lValue.type + '.');
                } else {
                    result = _operatorFn(lValue.value, rValue.value);
                }
            }
        }
    }
    return {
        type: 'boolean',
        value: result
    };
}

export function evaluateEqExpression(_parameters, _dynamicState, _context) {
    return evaluateCompareExpression(_parameters, _dynamicState, _context, 'Eq', (lhs, rhs) => lhs === rhs);
}


export function evaluateGtExpression(_parameters, _dynamicState, _context) {
    return evaluateCompareExpression(_parameters, _dynamicState, _context, 'Gt', (lhs, rhs) => lhs > rhs);
}


export function evaluateLtExpression(_parameters, _dynamicState, _context) {
    return evaluateCompareExpression(_parameters, _dynamicState, _context, 'Lt', (lhs, rhs) => lhs < rhs);
}


export function evaluateGtEqExpression(_parameters, _dynamicState, _context) {
    return evaluateCompareExpression(_parameters, _dynamicState, _context, 'GtEq', (lhs, rhs) => lhs >= rhs);
}


export function evaluateLtEqExpression(_parameters, _dynamicState, _context) {
    return evaluateCompareExpression(_parameters, _dynamicState, _context, 'LtEq', (lhs, rhs) => lhs <= rhs);
}


export function evaluateOrExpression(_parameters, _dynamicState, _context) {
    for (let i = 0; i < _parameters.length; i++) {
        if (isTrueValue(evaluateExpression(_parameters[i], _dynamicState, _context))) { return trueValue; }
    }
    return falseValue;
}


export function evaluateAndExpression(_parameters, _dynamicState, _context) {
    for (let i = 0; i < _parameters.length; i++) {
        if (!isTrueValue(evaluateExpression(_parameters[i], _dynamicState, _context))) { return falseValue; }
    }
    return trueValue;
}
