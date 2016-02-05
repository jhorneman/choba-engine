import isObject from './isObject';
import { getInitialGameState } from './engine';


export const actionHandlers = {
    'goto': handleGotoAction,
    'restart': handleRestartAction
};


export function handleAction(_actionType, _parameters, _dynamicState, _context) {
    let dynamicState = _dynamicState;

    if (isObject(_context) && _context.hasOwnProperty('reportError')) {
        if (_context.actionHandlers.hasOwnProperty(_actionType)) {
            dynamicState = _context.actionHandlers[_actionType](_parameters, _dynamicState, _context);
            if (!isObject(dynamicState)) {
                _context.reportError('Action handler didn\'t return an object.');
                dynamicState = {};
            }
        } else {
            _context.reportError('Unknown action type \'' + _actionType + '\'.');
        }
    }

    return dynamicState;
}

export function handleGotoAction(_parameters, _dynamicState) {
    return Object.assign({}, _dynamicState, {
        currentSceneId: _parameters[0]
    });
}

export function handleRestartAction() {
    return getInitialGameState();
}
