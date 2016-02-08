import expect from 'expect';
import { handleAction,
         handleGotoAction,
         handleRestartAction } from '../src/actions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from './testHelpers';


describe('general action handling', () => {
    let context, reportError;

    beforeEach('set up common test variables', function() {
        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with a missing context', () => {
        let originalDynamicState = {};
        let newDynamicState = handleAction('goto', {}, originalDynamicState, undefined);
        expect(newDynamicState).toBe(originalDynamicState);
    });

    it('deals with a context without an error reporting function', () => {
        let originalDynamicState = {};
        let newDynamicState = handleAction('goto', {}, originalDynamicState, {});
        expect(newDynamicState).toBe(originalDynamicState);
    });

    it('deals with an unknown action type', () => {
        const wrongType = 'YARGLA';
        let originalDynamicState = {};
        let newDynamicState = handleAction(wrongType, {}, originalDynamicState, context);
        expect(newDynamicState).toBe(originalDynamicState);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Unknown action type \'' + wrongType + '\'.']);
    });

    // TODO: Write more tests for passing bad parameters. E.g. object, string.
    it('handles actions correctly', () => {
        let originalDynamicState = {currentSceneId: 'first'};
        let newDynamicState = handleAction('goto', ['second'], originalDynamicState, context);
        expect(newDynamicState).toEqual({currentSceneId: 'second'});
        expect(reportError).toNotHaveBeenCalled();
    });
});


describe('goto action handling', () => {
    let context, reportError;

    beforeEach('set up common test variables', function() {
        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    // TODO: Write more tests for passing bad parameters. E.g. object, string.
    it('handles goto action correctly', () => {
        let originalDynamicState = {currentSceneId: 'first'};
        let newDynamicState = handleGotoAction(['second'], originalDynamicState, context);
        expect(newDynamicState).toEqual({currentSceneId: 'second'});
        expect(reportError).toNotHaveBeenCalled();
    });
});


describe('restart action handling', () => {
    let context, reportError;

    beforeEach('set up common test variables', function() {
        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    // TODO: Write more tests for passing bad parameters. E.g. object, string.
    it('restarts correctly', () => {
        let newDynamicState = handleRestartAction(undefined, undefined, context);
        expect(reportError).toNotHaveBeenCalled();
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
    });
});
