import { nullValue } from '../types';
import { evaluateExpression } from './expression';


function evaluatePlusMinusExpression(_parameters, _dynamicState, _context, _operatorName, _operatorFn) {
    if (_parameters.length !== 2) {
        _context.reportError(_operatorName + ' has ' + _parameters.length + ' parameters, 2 were expected.');
        return nullValue;
    }

    let parameterValue1 = evaluateExpression(
        _parameters[0],
        _dynamicState,
        _context
    ),
        parameterValue2 = evaluateExpression(
        _parameters[1],
        _dynamicState,
        _context
    );

    if (parameterValue1.type !== parameterValue2.type) {
        _context.reportError(_operatorName + ': The first parameter has the type ' + parameterValue1.type + ', but the second one has the type ' + parameterValue2.type + '. All parameters must have the same type.');
        return nullValue;
    }

    if ((parameterValue1.type !== 'integer') && (parameterValue1.type !== 'string')) {
        _context.reportError(_operatorName + ': Only integers and strings are supported, not ' + parameterValue1.type + '.');
        return nullValue;
    }

    const combinedValue = _operatorFn(parameterValue1.value, parameterValue2.value);

    return {
        type: parameterValue1.type,
        value: combinedValue
    };
}

export function evaluateAddExpression(_parameters, _dynamicState, _context) {
    return evaluatePlusMinusExpression(_parameters, _dynamicState, _context, 'Add', (lhs, rhs) => lhs + rhs);
}

export function evaluateSubtractExpression(_parameters, _dynamicState, _context) {
    return evaluatePlusMinusExpression(_parameters, _dynamicState, _context, 'Subtract', (lhs, rhs) => lhs - rhs);
}
