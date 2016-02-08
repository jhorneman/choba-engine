import expect from 'expect';
import { evaluateRandomPercentageExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('random percentage expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('evaluates correctly', () => {
        let rngSpy = expect.spyOn(context, '_rng').andCall(() => { return 0; });
        let value = evaluateRandomPercentageExpression([], dynamicState, context);
        expect(value).toEqual({
            type: 'integer',
            value: 0
        });
        expect(reportError).toNotHaveBeenCalled();
        expect(rngSpy).toHaveBeenCalled();
    });
});
