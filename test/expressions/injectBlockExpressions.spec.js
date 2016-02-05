import expect from 'expect';
import { nullValue } from '../../src/types';
import { evaluateInjectBlockExpression } from '../../src/expressions/tagBasedExpressions';
import { setUpDynamicStateAndContextAndReportErrorSpy } from '../testHelpers';


describe('inject block expression evaluation', () => {
    const testText = 'Found me!';
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with not finding a block', () => {
        const block = {
            tags: ['a', 'b'],
            content: ['text', testText]
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression(['c'], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Could not find any blocks with tags c.']);
    });

    it('deals with blocks without content', () => {
        const block = {
            tags: ['a', 'b']
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression(['a', 'b'], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Block has no content field.']);
    });

    it('deals with a non-array as a tag list', () => {
        const block = {
            tags: ['a', 'b']
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression(0, dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(2);
        expect(reportError.calls[0].arguments).toEqual(['Expected an array as the tag list, got number.']);
        expect(reportError.calls[1].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('deals with an empty tag list', () => {
        const block = {
            tags: ['a', 'b']
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression([], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('deals with bad tags', () => {
        const block = {
            tags: ['a', 'b']
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression([undefined, {}], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(3);
        expect(reportError.calls[0].arguments).toEqual(['Tag \'undefined\' is neither a string nor an expression.']);
        expect(reportError.calls[1].arguments).toEqual(['Tag \'[object Object]\' is neither a string nor an expression.']);
        expect(reportError.calls[2].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('deals with badly nested parameters', () => {
        const block = {
            tags: ['a', 'b']
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression([['a', 'b']], dynamicState, context);
        expect(value).toEqual(nullValue);
        expect(reportError.calls.length).toEqual(2);
        expect(reportError.calls[0].arguments).toEqual(['Unknown operator \'a\'.']);
        expect(reportError.calls[1].arguments).toEqual(['Desired tag list was or evaluated to empty.']);
    });

    it('evaluates correctly', () => {
        const block = {
            tags: ['a', 'b'],
            content: ['text', testText]
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression(['a', 'b'], dynamicState, context);
        expect(value).toEqual({
            type: 'string',
            value: testText
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    it('evaluates correctly with an evaluated tag', () => {
        const block = {
            tags: ['a', 'b'],
            content: ['text', testText]
        }
        context.blocks = [ block ];
        let value = evaluateInjectBlockExpression(['a', ['literal', {type: 'string', value: 'b'}]], dynamicState, context);
        expect(value).toEqual({
            type: 'string',
            value: testText
        });
        expect(reportError).toNotHaveBeenCalled();
    });

    // TODO: REWRITE
    // it('deals with a tag that does not evaluate to a string', () => {
    //     const block = {
    //         tags: ['a'],
    //         content: ['text', testText]
    //     }
    //     context.blocks = { 'aBlock': block };
    //     let value = evaluateInjectBlockExpression(['a', ['literal', 0]], dynamicState, context);
    //     expect(value).toEqual({
    //         'text': testText
    //     });
    //     expect(reportError.calls.length).toEqual(1);
    //     expect(reportError.calls[0].arguments).toEqual(['Expected value with type string, got string.']);
    // });
});
