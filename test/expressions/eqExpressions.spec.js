import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateEqExpression } from '../../src/expressions/logicalExpressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('equality expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with too few parameters', () => {
        let value = evaluateEqExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Eq has 0 parameters, 2 were expected.']);
    });

    it('deals with too many parameters', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'integer', value: 0 }],
            ['literal', { type: 'integer', value: 0 }],
            ['literal', { type: 'integer', value: 0 }]
        ], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Eq has 3 parameters, 2 were expected.']);
    });

    it('evaluates correctly with identical integer literals', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'integer', value: 0 }],
            ['literal', { type: 'integer', value: 0 }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });

    it('evaluates correctly with identical string literals', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'string', value: 'a' }],
            ['literal', { type: 'string', value: 'a' }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });

    it('evaluates correctly with identical boolean literals', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'boolean', value: true }],
            ['literal', { type: 'boolean', value: true }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });

    it('evaluates correctly with different boolean literals', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'boolean', value: true }],
            ['literal', { type: 'boolean', value: false }]
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });

    it('deals with the first value evaluating to null', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'integer', value: 0 }],
            ['null']
        ], dynamicState, context);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Eq: null evaluated to null.']);
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });

    it('deals with the second value evaluating to null', () => {
        let value = evaluateEqExpression([
            ['null'],
            ['literal', { type: 'integer', value: 0 }]
        ], dynamicState, context);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Eq: null evaluated to null.']);
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });

    it('deals with both values evaluating to null', () => {
        let value = evaluateEqExpression([
            ['null'],
            ['null']
        ], dynamicState, context);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Eq: null evaluated to null.']);
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });

    it('deals with two values of different types', () => {
        let value = evaluateEqExpression([
            ['literal', { type: 'boolean', value: false }],
            ['literal', { type: 'integer', value: 0 }]
        ], dynamicState, context);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Eq: Type mismatch. literal false has type boolean while literal 0 has type integer.']);
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(false);
    });
});
