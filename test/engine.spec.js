import expect from 'expect';
import { restartGame,
         executeOption,
         buildCurrentScene } from '../src/engine';
import { setUpDynamicStateAndContextAndReportErrorSpy } from './testHelpers';


describe('engine', () => {
    let context, reportError;

    it('can restart a game', () => {
        const sceneText = 'YAY!';
        const sceneDesc = {
            content: ['text', sceneText]
        };

        context = {
            scenes: {
                start: sceneDesc
            },
            initialVars: {
                test: {
                    type: 'boolean',
                    value: true
                }
            }
        };
        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy(context));

        let { newScene: firstScene, dynamicState: firstDynamicState } = restartGame(context);

        expect(reportError).toNotHaveBeenCalled();
        expect(firstScene).toEqual({
            text: sceneText,
            options: [],
            desc: sceneDesc
        });
        expect(firstDynamicState).toEqual({
            currentSceneId: 'start',
            previousSceneId: '',
            tagState: {},
            vars: {
                test : {
                  type: 'boolean',
                  value: true
              },
                currentSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: 'start'
                },
                previousSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: ''
                }
            }
        });
    });

    it('can execute an option', () => {
        const endSceneId = 'end';
        const endSceneText = 'YAY!';
        const optionText = 'CHOOSE';
        const startSceneDesc = {
            content: ['addOption', ['literal', {type: 'string', value: optionText}], 'goto', endSceneId]
        };
        const endSceneDesc = {
            content: ['text', endSceneText]
        };

        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
        context.scenes['start'] = startSceneDesc;
        context.scenes['end'] = endSceneDesc;

        let { newScene, dynamicState: newDynamicState } = restartGame(context);

        expect(reportError).toNotHaveBeenCalled();
        expect(newScene).toEqual({
            text: '',
            options: [{
                action: 'goto',
                parameters: ['end'],
                text: optionText
            }],
            desc: startSceneDesc
        });
        expect(newDynamicState).toEqual({
            currentSceneId: 'start',
            previousSceneId: '',
            tagState: {},
            vars: {
                currentSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: 'start'
                },
                previousSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: ''
                }
            }
        });

        ({ newScene, dynamicState: newDynamicState } = executeOption(newDynamicState, context, newScene.options[0]));
        expect(reportError).toNotHaveBeenCalled();
        expect(newScene).toEqual({
            text: endSceneText,
            options: [],
            desc: endSceneDesc
        });
        expect(newDynamicState).toEqual({
            currentSceneId: endSceneId,
            previousSceneId: 'start',
            tagState: {},
            vars: {
                currentSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: endSceneId
                },
                previousSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: 'start'
                }
            }
        });
    });

    it('can build a scene', () => {
        const sceneText = 'YAY!';
        const sceneDesc = {
            content: ['text', sceneText]
        };

        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
        context.scenes['start'] = sceneDesc;

        let { newScene: firstScene, dynamicState: firstDynamicState } = restartGame(context);

        expect(reportError).toNotHaveBeenCalled();
        expect(firstScene).toEqual({
            text: sceneText,
            options: [],
            desc: sceneDesc
        });
        expect(firstDynamicState).toEqual({
            currentSceneId: 'start',
            previousSceneId: '',
            tagState: {},
            vars: {
                currentSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: 'start'
                },
                previousSceneId: {
                  readOnly: true,
                  type: 'string',
                  value: ''
                }
            }
        });

        let { newScene: builtScene, dynamicState: builtDynamicState } = buildCurrentScene(firstDynamicState, context);
        expect(builtScene).toEqual(firstScene);
        expect(builtDynamicState).toEqual(firstDynamicState);
    });
});
