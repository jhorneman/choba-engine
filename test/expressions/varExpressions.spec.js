import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateVarExpression } from '../../src/expressions/variableExpressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('var expression evaluation', () => {
    let context, reportError;
    const testVars = {
        testInt: {
            type: 'integer',
            value: 23
        },
        testBool: {
            type: 'boolean',
            value: true
        },
        testString: {
            type: 'string',
            value: 'Hello world'
        }
    };

    beforeEach('set up common test variables', function() {
        ({context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with too few parameters', () => {
        let value = evaluateVarExpression([], {vars: {}}, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Var has 0 parameters, 1 was expected.']);
    });

    it('deals with too many parameters', () => {
        let value = evaluateVarExpression(['testInt', 5], {vars: {}}, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Var has 2 parameters, 1 was expected.']);
    });

    it('deals with non-existent variables', () => {
        const wrongVarName = 'stuff';
        let value = evaluateVarExpression([wrongVarName], {vars: {}}, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Variable \'' + wrongVarName + '\' not found.']);
    });

    it('gets an existing integer variable', () => {
        let value = evaluateVarExpression(['testInt'], {vars: testVars}, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('integer');
        expect(value.value).toEqual(23);
    });

    it('gets an existing boolean variable', () => {
        let value = evaluateVarExpression(['testBool'], {vars: testVars}, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('boolean');
        expect(value.value).toEqual(true);
    });

    it('gets an existing string variable', () => {
        let value = evaluateVarExpression(['testString'], {vars: testVars}, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('string');
        expect(value.value).toEqual('Hello world');
    });
});
