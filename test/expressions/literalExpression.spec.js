import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateLiteralExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('literal expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('evaluates correctly', () => {
        let value = evaluateLiteralExpression([
                { type: 'boolean', value: true }
            ], dynamicState, context);
        expect(value).toEqual({
            type: 'boolean',
            value: true
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    it('deals with an invalid value', () => {
        let value = evaluateLiteralExpression([ true ], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Value is not an object.']);
    });
});
