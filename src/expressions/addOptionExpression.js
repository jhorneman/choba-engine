import { nullValue } from '../types';
import { evaluateExpressionThatResultsInText } from './expression';


export function evaluateAddOptionExpression(_parameters, _dynamicState, _context) {
    const optionText = evaluateExpressionThatResultsInText(_parameters[0], _dynamicState, _context);
    if (optionText.length > 0) {
        return {
            type: 'options',
            value: [{
                text: optionText,
                action: _parameters[1],
                parameters: _parameters.slice(2)
            }]
        };
    } else {
        _context.reportError('Option has empty text.');
        return nullValue;
    }
}
