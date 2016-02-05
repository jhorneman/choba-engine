import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateExpression } from '../../src/expressions/expression';
import { setUpDynamicStateAndContextAndReportErrorSpy,
         setUpSetCommandAndVars } from '../testHelpers';


describe('expression evaluation', () => {
    const emptyScenePart = {
        type: 'scenePart',
        value: {}
    };
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with a non-array expression', () => {
        let value = evaluateExpression(0, dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Expected an array as the expression, got number.']);
    });

    it('deals with an empty expression', () => {
        let value = evaluateExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError).toNotHaveBeenCalled();
    });

    it('deals with an unknown operator', () => {
        const wrongOperator = 'YARGLA';
        let value = evaluateExpression([wrongOperator], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Unknown operator \'' + wrongOperator + '\'.']);
    });

    it ('deals with an expression returning an invalid value', () => {
        const brokenOperator = 'broken';

        let evaluateBrokenExpressionSpy = expect.createSpy().andReturn(0);
        let brokenContext = Object.assign({}, context);
        brokenContext.expressionEvaluators = Object.assign({}, context.expressionEvaluators);
        brokenContext.expressionEvaluators[brokenOperator] = evaluateBrokenExpressionSpy;

        let value = evaluateExpression(['broken'], dynamicState, brokenContext);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(2);
        expect(reportError.calls[0].arguments).toEqual(['Value is not an object.']);
        expect(reportError.calls[1].arguments).toEqual(['Operator \'' + brokenOperator + '\' returned an invalid value.']);
        expect(evaluateBrokenExpressionSpy).toHaveBeenCalled();
    });

    // TODO: This test tests the wrapping around another function. Is this OK?
    it('deals with badly nested sequence data', () => {
        // The seq operator's arguments don't need to be put into another array.
        // The expression is already an array.
        let value = evaluateExpression(['seq', [
            ['text', 'A'],
        ]], dynamicState, context);
        expect(value).toEqual(emptyScenePart);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Unknown operator \'text,A\'.']);
    });

    // TODO: This test tests the wrapping around another function. Is this OK?
    it('evaluates correctly', () => {
        const testText = 'Hello world';
        let value = evaluateExpression(['text', testText], dynamicState, context);
        expect(value).toEqual({
            type: 'string',
            value: testText
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    // TODO: This test tests the wrapping around another function. Is this OK?
    it('propagates game state', () => {
        let { vars, setCommand, expectedVars } = setUpSetCommandAndVars();
        let value = evaluateExpression(
            setCommand,
            {vars: vars},
            context
        );
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('dynamicState');
        expect(value.value.vars).toEqual(expectedVars);
    });
});
