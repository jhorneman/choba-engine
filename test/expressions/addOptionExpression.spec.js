import expect from 'expect';
import { evaluateAddOptionExpression } from '../../src/expressions/addOptionExpression';
import { setUpDynamicStateAndContextAndReportErrorSpy,
         buildGotoOptionExpression } from '../testHelpers';


describe('goto expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('evaluates correctly', () => {
        const sceneId = 'sceneC';
        let value = evaluateAddOptionExpression(buildGotoOptionExpression(sceneId).slice(1), dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('options');
        expect(value.value).toEqual([{text: 'Go to ' + sceneId, action: 'goto', parameters: [sceneId]}]);
    });
});
