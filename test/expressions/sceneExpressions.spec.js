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
        options: []
    };

    it('deals with no context', () => {
        let scene = evaluateScene(sceneId, dynamicState, undefined);
        expect(scene).toEqual(emptyScene);
    });

    it('deals with a context without reportError', () => {
        delete context.reportError;
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
    });

    it('deals with no scenes', () => {
        delete context.scenes;
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Context is missing scenes property.']);
    });

    it('deals with a non-existent scene', () => {
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Unknown scene \'' + sceneId + '\'.']);
    });

    it('deals with a scene without content', () => {
        context.scenes[sceneId] = [];
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(scene).toEqual(emptyScene);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Scene \'' + sceneId + '\' has no content field.']);
    });

    it('builds a scene with text', () => {
        let sceneText = 'YAY!';
        context.scenes[sceneId] = {
            content: ['text', sceneText]
        };
        reportError = expect.spyOn(context, 'reportError');
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: sceneText, options: []});
    });

    it('builds a scene with options', () => {
        const nextSceneId = 'sceneD';
        context.scenes[sceneId] = {
            content: buildGotoOptionExpression(nextSceneId)
        };
        reportError = expect.spyOn(context, 'reportError');
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: '', options: [
            {text: 'Go to ' + nextSceneId, action: 'goto', parameters: [nextSceneId]}
        ]});
    });

    it('builds a scene with dynamic state', () => {
        let { vars, setCommand, expectedVars } = setUpSetCommandAndVars();
        context.scenes[sceneId] = {
            content: setCommand
        };
        reportError = expect.spyOn(context, 'reportError');
        let scene = evaluateScene(sceneId, {vars: vars}, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: '', options: [], dynamicState: {vars: expectedVars}});
    });

    it('deals with expressions returning types it cannot handle', () => {
        context.scenes[sceneId] = {
            content: ['literal', { type: 'integer', value: 0 }]
        };
        reportError = expect.spyOn(context, 'reportError');
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['evaluateScene: Don\'t know how to handle value of type \'integer\'.']);
        expect(scene).toEqual({text: '', options: []});
    });

    it('deals with expressions returning null', () => {
        context.scenes[sceneId] = {
            content: ['null']
        };
        reportError = expect.spyOn(context, 'reportError');
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: '', options: []});
    });

    it('deals with expressions returning scene parts', () => {
        const sceneText = 'YAY!';
        const nextSceneId = 'sceneD';
        context.scenes[sceneId] = {
            content: ['seq',
                ['text', sceneText],
                buildGotoOptionExpression(nextSceneId)
            ]
        };
        reportError = expect.spyOn(context, 'reportError');
        let scene = evaluateScene(sceneId, dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(scene).toEqual({text: sceneText, options: [
            {text: 'Go to ' + nextSceneId, action: 'goto', parameters: [nextSceneId]}
        ]});
    });
});
