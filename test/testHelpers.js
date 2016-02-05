import expect from 'expect';
import cloneDeep from 'lodash/cloneDeep';
import { buildContext } from '../src/context';


export function setUpDynamicStateAndContextAndReportErrorSpy() {
    let context = buildContext({reportError: () => {}});
    let reportErrorSpy = expect.spyOn(context, 'reportError');
    return {
        dynamicState: { vars: {}, tagState: {} },
        context: context,
        reportError: reportErrorSpy
    };
}

export function setUpSetCommandAndVars() {
    const newValue = 'NEW VALUE';
    let testVars = {
        testString: {
            type: 'string',
            value: 'OLD VALUE'
        }
    };
    let expectedVars = cloneDeep(testVars);
    expectedVars.testString.value = newValue;
    return {
        vars: testVars,
        setCommand: ['set', 'testString', ['literal', { type: 'string', value: newValue} ]],
        expectedVars: expectedVars
    };
}

export function buildGotoOptionExpression(_optionName) {
    return [
        'addOption',
        ['text', 'Go to ' + _optionName],
        'goto',
        _optionName
    ];
}
