import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateTextExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('text expression evaluation', () => {
    const testText = 'Hello world';
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with too few parameters', () => {
        let value = evaluateTextExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Text has 0 parameters, 1 was expected.']);
    });

    it('deals with too many parameters', () => {
        let value = evaluateTextExpression([testText, 'wat'], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Text has 2 parameters, 1 was expected.']);
    });

    it('evaluates correctly', () => {
        let value = evaluateTextExpression([testText], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('string');
        expect(value.value).toEqual(testText);
    });
});
