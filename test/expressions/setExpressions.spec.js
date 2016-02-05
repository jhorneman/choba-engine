import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateSetExpression } from '../../src/expressions/variableExpressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('set expression evaluation', () => {
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
        let value = evaluateSetExpression(['testInt'], {vars: testVars}, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Set has 1 parameters, 2 were expected.']);
    });

    it('deals with too many parameters', () => {
        let value = evaluateSetExpression(['testInt', 5, 6], {vars: testVars}, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Set has 3 parameters, 2 were expected.']);
    });

    it('deals with non-existent variables', () => {
        const wrongVarName = 'stuff';
        let value = evaluateSetExpression(
            [wrongVarName, ['literal', { type: 'string', value: 'yeah!'} ]],
            {vars: {}},
            context
        );
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Variable \'' + wrongVarName + '\' not found.']);
    });

    it('deals with a type mismatch', () => {
        let value = evaluateSetExpression(
            ['testString', ['literal', { type: 'integer', value: 44} ]],
            {vars: Object.assign({}, testVars)},
            context
        );
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Variable \'testString\' has type string while the new value has the type integer.']);
    });

    it('modifies an existing string variable', () => {
        const newValue = 'yeah!';
        let value = evaluateSetExpression(
            ['testString', ['literal', { type: 'string', value: newValue} ]],
            {vars: Object.assign({}, testVars)},
            context
        );
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('dynamicState');
        let expectedVars = Object.assign({}, testVars);
        expectedVars.testString.value = newValue;
        expect(value.value).toEqual({vars: expectedVars});
    });
});
