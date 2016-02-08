import { evaluateScene } from './expressions/sceneExpression';
import { handleAction } from './actions';


export function getInitialDynamicState(_context) {
    let dynamicState = Object.assign({}, {
        currentSceneId: _context.firstSceneId,
        previousSceneId: '',
        tagState: {},
        vars: Object.assign({}, _context.initialVars)
    });
    dynamicState.vars.currentSceneId.value = dynamicState.currentSceneId;
    return dynamicState;
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
        _option.action,
        _option.parameters,
        dynamicState,
        context
    );
    // Special variable treatment.
    if (oldSceneId !== newDynamicState.currentSceneId) {
        newDynamicState.previousSceneId = oldSceneId;
        newDynamicState.vars.currentSceneId.value = newDynamicState.currentSceneId;
        newDynamicState.vars.previousSceneId.value = oldSceneId;
    }
    // Every option will result in rebuilding the current scene.
    return buildCurrentScene(newDynamicState, context);
}

// (Function is only exported for testing: it is not called outside this module.)
export function buildCurrentScene(dynamicState, context) {
    let {scene: newScene, dynamicState: newDynamicState} = evaluateScene(dynamicState.currentSceneId, dynamicState, context);
    return {
        newScene: newScene,
        dynamicState: newDynamicState
    };
}
