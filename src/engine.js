import isEqual from 'lodash/isEqual';
import { buildContext } from './context';
import { evaluateScene } from './expressions/sceneExpression';
import { handleAction } from './actions';


function getInitialDynamicState(_context) {
    return Object.assign({}, {
        currentSceneId: _context.firstSceneId,
        tagState: {},
        vars: _context.initialVars
    });
}

export function initializeGame(_context) {
    return restartGame(buildContext(_context));
}

export function restartGame(context) {
    return buildCurrentScene(
        getInitialDynamicState(context),
        context
    );
}

export function executeOption(dynamicState, context, _option) {
    const oldSceneId = dynamicState.currentSceneId;
    let newDynamicState = handleAction(
        _option['action'],
        _option['parameters'],
        dynamicState,
        context
    );
    // Special variable treatment.
    if (oldSceneId !== newDynamicState.currentSceneId) {
        newDynamicState.vars.currentsceneId = newDynamicState.currentSceneId;
        newDynamicState.vars.previousSceneId = oldSceneId;
    }
    // Every option will result in rebuilding the current scene.
    return buildCurrentScene(newDynamicState, context);
}

// (Function is only exported for testing: it is not called outside this module.)
export function buildCurrentScene(dynamicState, context) {
    let {scene: newScene, dynamicState: newDynamicState} = evaluateScene(dynamicState['currentSceneId'], dynamicState, context);
    return {
        newScene: newScene,
        dynamicState: newDynamicState,
        context: context
    };
}
