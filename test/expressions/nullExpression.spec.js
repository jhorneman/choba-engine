import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateNullExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('null expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('evaluates correctly', () => {
        let value = evaluateNullExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError).toNotHaveBeenCalled();
    });
});
