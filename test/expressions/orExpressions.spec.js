import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateOrExpression } from '../../src/expressions/logicalExpressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('or expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('evaluates correctly with zero parameters', () => {
        let value = evaluateOrExpression([], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });

    it('evaluates correctly with one boolean literal', () => {
        let value = evaluateOrExpression([
            ['literal', { type: 'boolean', value: true }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });

    it('evaluates correctly with multiple boolean literals', () => {
        let value = evaluateOrExpression([
            ['literal', { type: 'boolean', value: true }],
            ['literal', { type: 'boolean', value: false }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });

    it('evaluates correctly with multiple boolean literals, all false', () => {
        let value = evaluateOrExpression([
            ['literal', { type: 'boolean', value: false }],
            ['literal', { type: 'boolean', value: false }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });

    it('evaluates correctly with a boolean literal and a non-boolean', () => {
        let value = evaluateOrExpression([
            ['literal', { type: 'integer', value: 1 }],
            ['literal', { type: 'boolean', value: true }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });
});
