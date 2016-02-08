import { handleGotoAction,
         handleRestartAction } from './actions.js';


export const actionHandlers = {
    'goto': handleGotoAction,
    'restart': handleRestartAction
};
