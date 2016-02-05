import { getRandomInt } from '../context';
import { nullValue, isValidValue, isTrueValue } from '../types';
import { evaluateExpression, evaluateArrayOfScenePartExpressions } from './expression';


export function evaluateSeqExpression(_parameters, _dynamicState, _context) {
    return evaluateArrayOfScenePartExpressions(_parameters, _dynamicState, _context);
}

export function evaluateTextExpression(_parameters, _dynamicState, _context) {
    if (_parameters.length !== 1) {
        _context.reportError('Text has ' + _parameters.length + ' parameters, 1 was expected.');
        return nullValue;
    }
    return {
        type: 'string',
        value: _parameters[0]
    };
}

export function evaluateIfExpression(_parameters, _dynamicState, _context) {
    if ((_parameters.length < 2) || (_parameters.length > 3)) {
        _context.reportError('If has ' + _parameters.length + ' parameters, 2 or 3 were expected.');
        return nullValue;
    }
    if (isTrueValue(evaluateExpression(_parameters[0], _dynamicState, _context))) {
        return evaluateExpression(_parameters[1], _dynamicState, _context);
    } else {
        if (_parameters.length > 2) {
            return evaluateExpression(_parameters[2], _dynamicState, _context);
        } else {
            return nullValue;
        }
    }
}

export function evaluateOneOfExpression(_parameters, _dynamicState, _context) {
    if (_parameters.length === 0) { return nullValue; }
    const selectedBranch = getRandomInt(_context, _parameters.length);
    return evaluateExpression(_parameters[selectedBranch], _dynamicState, _context);
}

export function evaluateLiteralExpression(_parameters, _dynamicState, _context) {
    return isValidValue(_parameters[0], _context.reportError) ? _parameters[0] : nullValue; 
}

export function evaluateNullExpression() {
    return nullValue;
}

export function evaluateRandomPercentageExpression(_parameters, _dynamicState, _context) {
    return {
        type: 'integer',
        value: getRandomInt(_context, 100)
    };
}
