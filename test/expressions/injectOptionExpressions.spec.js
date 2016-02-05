import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateInjectOptionExpression } from '../../src/expressions/tagBasedExpressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('inject option expression evaluation', () => {
    const testLeadIn = 'Pick me!';
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with not finding a scene', () => {
        const scene = {
            tags: ['a', 'b'],
            leadIn: ['text', testLeadIn]
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression(['c'], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Could not find any scenes with tags c.']);
    });

    it('deals with scenes without a lead-in', () => {
        const scene = {
            tags: ['a', 'b']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression(['a', 'b'], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Scene has no lead-in field.']);
    });

    it('deals with scenes with a non-string lead-in', () => {
        const scene = {
            tags: ['a', 'b'],
            leadIn: ['null']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression(['a', 'b'], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Don\'t know how to handle lead-in values of type \'null\'.']);
    });

    it('deals with a non-array as a tag list', () => {
        const scene = {
            tags: ['a', 'b']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression(0, dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(2);
        expect(reportError.calls[0].arguments).toEqual(['Expected an array as the tag list, got number.']);
        expect(reportError.calls[1].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('deals with an empty tag list', () => {
        const scene = {
            tags: ['a', 'b']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('deals with bad tags', () => {
        const scene = {
            tags: ['a', 'b']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression([undefined, {}], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(3);
        expect(reportError.calls[0].arguments).toEqual(['Tag \'undefined\' is neither a string nor an expression.']);
        expect(reportError.calls[1].arguments).toEqual(['Tag \'[object Object]\' is neither a string nor an expression.']);
        expect(reportError.calls[2].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('deals with badly nested parameters', () => {
        const scene = {
            tags: ['a', 'b']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression([['a', 'b']], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(2);
        expect(reportError.calls[0].arguments).toEqual(['Unknown operator \'a\'.']);
        expect(reportError.calls[1].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('evaluates correctly', () => {
        const scene = {
            tags: ['a', 'b'],
            leadIn: ['text', testLeadIn],
            content: ['text', 'Hello world']
        };
        context.scenes = { 'aScene': scene };
        let value = evaluateInjectOptionExpression(['a', 'b'], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('options');
        expect(value.value).toEqual([{text: testLeadIn, action: 'goto', parameters: {nextSceneId: 'aScene'}}]);
    });
});
