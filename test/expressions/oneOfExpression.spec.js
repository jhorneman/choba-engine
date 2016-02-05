import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateOneOfExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('oneOf expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with no parameters', () => {
        let value = evaluateOneOfExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError).toNotHaveBeenCalled();
    });

    it('deals with a single parameter', () => {
        const testText = 'Hello world';
        let value = evaluateOneOfExpression([
            ['text', testText],
        ], dynamicState, context);
        expect(value.type).toEqual('string');
        expect(value.value).toEqual(testText);
        expect(reportError).toNotHaveBeenCalled();
    });

    it('deals with multiple parameters', () => {
        const testText = 'Hello world';
        let rngSpy = expect.spyOn(context, '_rng').andCall(() => { return 0; });
        let value = evaluateOneOfExpression([
            ['text', testText],
            ['text', 'a'],
            ['text', 'b'],
        ], dynamicState, context);
        expect(value.type).toEqual('string');
        expect(value.value).toEqual(testText);
        expect(reportError).toNotHaveBeenCalled();
        expect(rngSpy).toHaveBeenCalled();
    });
});
