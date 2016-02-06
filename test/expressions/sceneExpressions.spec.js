import expect from 'expect';
import { evaluateScene } from '../../src/expressions/sceneExpression';
import { setUpDynamicStateAndContextAndReportErrorSpy,
         setUpSetCommandAndVars,
         buildGotoOptionExpression } from '../testHelpers';


describe('scene evaluation', () => {
    let sceneId = 'aScene';
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    const emptyScene = {
        text: '',
        options: [],
        desc: undefined
    };

    it('deals with no context', () => {
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, undefined);
        expect(scene).toEqual(emptyScene);
        expect(newDynamicState).toBe(dynamicState);
    });

    it('deals with a context without reportError', () => {
        delete context.reportError;
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
        expect(newDynamicState).toBe(dynamicState);
    });

    it('deals with no scenes', () => {
        delete context.scenes;
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Context is missing scenes property.']);
        expect(newDynamicState).toBe(dynamicState);
    });

    it('deals with a non-existent scene', () => {
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Unknown scene \'' + sceneId + '\'.']);
        expect(newDynamicState).toBe(dynamicState);
    });

    it('deals with a scene without content', () => {
        const sceneDesc = [];
        context.scenes[sceneId] = sceneDesc;
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual({text: '', options: [], desc: sceneDesc});
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Scene \'' + sceneId + '\' has no content field.']);
        expect(newDynamicState).toBe(dynamicState);
    });

    it('builds a scene with text', () => {
        const sceneText = 'YAY!';
        const sceneDesc = {
            content: ['text', sceneText]
        };
        context.scenes[sceneId] = sceneDesc;
        reportError = expect.spyOn(context, 'reportError');
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: sceneText, options: [], desc: sceneDesc});
        expect(newDynamicState).toBe(dynamicState);
    });

    it('builds a scene with options', () => {
        const nextSceneId = 'sceneD';
        const sceneDesc = {
            content: buildGotoOptionExpression(nextSceneId)
        };
        context.scenes[sceneId] = sceneDesc;
        reportError = expect.spyOn(context, 'reportError');
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({
            text: '',
            options: [
                {text: 'Go to ' + nextSceneId, action: 'goto', parameters: [nextSceneId]}
            ],
            desc: sceneDesc
        });
        expect(newDynamicState).toBe(dynamicState);
    });

    it('builds a scene with dynamic state', () => {
        let { vars, setCommand, expectedVars } = setUpSetCommandAndVars();
        const sceneDesc = {
            content: setCommand
        };
        context.scenes[sceneId] = sceneDesc;
        reportError = expect.spyOn(context, 'reportError');
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, {vars: vars}, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: '', options: [], desc: sceneDesc});
        expect(newDynamicState).toEqual({vars: expectedVars});
    });

    it('deals with expressions returning types it cannot handle', () => {
        const sceneDesc = {
            content: ['literal', { type: 'integer', value: 0 }]
        };
        context.scenes[sceneId] = sceneDesc;
        reportError = expect.spyOn(context, 'reportError');
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['evaluateScene: Don\'t know how to handle value of type \'integer\'.']);
        expect(scene).toEqual({text: '', options: [], desc: sceneDesc});
        expect(newDynamicState).toBe(dynamicState);
    });

    it('deals with expressions returning null', () => {
        const sceneDesc = {
            content: ['null']
        };
        context.scenes[sceneId] = sceneDesc;
        reportError = expect.spyOn(context, 'reportError');
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: '', options: [], desc: sceneDesc});
        expect(newDynamicState).toBe(dynamicState);
    });

    it('deals with expressions returning scene parts', () => {
        const sceneText = 'YAY!';
        const nextSceneId = 'sceneD';
        const sceneDesc = {
            content: ['seq',
                ['text', sceneText],
                buildGotoOptionExpression(nextSceneId)
            ]
        };
        context.scenes[sceneId] = sceneDesc;
        reportError = expect.spyOn(context, 'reportError');
        let { scene, dynamicState: newDynamicState } = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene.text).toEqual(sceneText);
        expect(scene.options).toEqual([
            {text: 'Go to ' + nextSceneId, action: 'goto', parameters: [nextSceneId]}
        ]);
        expect(scene.desc).toEqual(sceneDesc);
        expect(newDynamicState).toBe(dynamicState);
    });
});
