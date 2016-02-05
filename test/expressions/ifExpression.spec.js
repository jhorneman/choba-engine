import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateIfExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('if expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('evaluates true branch correctly', () => {
        let value = evaluateIfExpression([
                ['literal', { type: 'boolean', value: true }],
                ['text', 'true'],
                ['text', 'false']
            ], dynamicState, context);
        expect(value).toEqual({
            type: 'string',
            value: 'true'
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    it('evaluates false branch correctly', () => {
        let value = evaluateIfExpression([
                ['literal', { type: 'boolean', value: false }],
                ['text', 'true'],
                ['text', 'false']
            ], dynamicState, context);
        expect(value).toEqual({
            type: 'string',
            value: 'false'
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    it('evaluates correctly when the condition is true and there is no false branch', () => {
        let value = evaluateIfExpression([
                ['literal', { type: 'boolean', value: true }],
                ['text', 'true']
            ], dynamicState, context);
        expect(value).toEqual({
            type: 'string',
            value: 'true'
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    it('evaluates correctly when the condition is false and there is no false branch', () => {
        let value = evaluateIfExpression([
                ['literal', { type: 'boolean', value: false }],
                ['text', 'true']
            ], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError).toNotHaveBeenCalled();
    });

    it('deals with too few parameters', () => {
        let value = evaluateIfExpression([
                ['literal', { type: 'boolean', value: true }]
            ], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['If has 1 parameters, 2 or 3 were expected.']);
    });

    it('deals with no parameters', () => {
        let value = evaluateIfExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['If has 0 parameters, 2 or 3 were expected.']);
    });

    it('deals with too many parameters', () => {
        let value = evaluateIfExpression([
                ['literal', { type: 'boolean', value: true }],
                ['literal', { type: 'boolean', value: true }],
                ['literal', { type: 'boolean', value: true }],
                ['literal', { type: 'boolean', value: true }]
            ], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['If has 4 parameters, 2 or 3 were expected.']);
    });
});
