import { nullValue } from '../types';
import { evaluateExpression } from './expression';


export function evaluateVarExpression(_parameters, _dynamicState, _context) {
    if (_parameters.length !== 1) {
        _context.reportError('Var has ' + _parameters.length + ' parameters, 1 was expected.');
        return nullValue;
    }

    const varName = _parameters[0];
    if (_dynamicState.vars.hasOwnProperty(varName)) {
        return _dynamicState.vars[varName];
    } else {
        _context.reportError('Variable \'' + varName + '\' not found.');
        return nullValue;
    }
}

export function evaluateSetExpression(_parameters, _dynamicState, _context) {
    if (_parameters.length !== 2) {
        _context.reportError('Set has ' + _parameters.length + ' parameters, 2 were expected.');
        return nullValue;
    }

    const varName = _parameters[0];
    if (_dynamicState.vars.hasOwnProperty(varName)) {
        if (_dynamicState.vars[varName].readOnly) {
            _context.reportError('Variable \'' + varName + '\' is read only.');
            return nullValue;

        } else {
            const newValue = evaluateExpression(
                _parameters[1],
                _dynamicState,
                _context
            );

            if (newValue.type === _dynamicState.vars[varName].type) {
                let newVars = Object.assign({}, _dynamicState.vars);
                newVars[varName] = {
                    type: newValue.type,
                    value: newValue.value
                };
                _dynamicState.vars = newVars
                return {
                    type: 'dynamicState',
                    value: _dynamicState
                };

            } else {
                _context.reportError('Variable \'' + varName + '\' has type ' + _dynamicState.vars[varName].type + ' while the new value has the type ' + newValue.type + '.');
                return nullValue;
            }
        }
    } else {
        _context.reportError('Variable \'' + varName + '\' not found.');
        return nullValue;
    }
}
