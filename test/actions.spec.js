import expect from 'expect';
import { handleAction,
         handleGotoAction } from '../src/actions';
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

    it('handles actions correctly', () => {
        let originalDynamicState = {currentSceneId: 'first'};
        let newDynamicState = handleAction('goto', {nextSceneId: 'second'}, originalDynamicState, context);
        expect(newDynamicState).toEqual({currentSceneId: 'second'});
        expect(reportError).toNotHaveBeenCalled();
    });
});


describe('goto action handling', () => {
    let context, reportError;

    beforeEach('set up common test variables', function() {
        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('handles goto actions correctly', () => {
        let originalDynamicState = {currentSceneId: 'first'};
        let newDynamicState = handleGotoAction({nextSceneId: 'second'}, originalDynamicState, context);
        expect(newDynamicState).toEqual({currentSceneId: 'second'});
        expect(reportError.calls.length).toEqual(0);
    });
});
