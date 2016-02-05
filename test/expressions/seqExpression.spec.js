import expect from 'expect';
import { evaluateSeqExpression } from '../../src/expressions/expressions';
import { setUpDynamicStateAndContextAndReportErrorSpy,
         setUpSetCommandAndVars,
         buildGotoOptionExpression } from '../testHelpers';


describe('sequence expression evaluation', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with an empty sequence', () => {
        let value = evaluateSeqExpression([], dynamicState, context);
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({});
        expect(reportError).toNotHaveBeenCalled();
    });

    it('deals with badly nested data', () => {
        let value = evaluateSeqExpression([[
            ['text', 'A']
        ]], dynamicState, context);
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({});
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Unknown operator \'text,A\'.']);
    });

    it('deals with expressions returning types it cannot handle', () => {
        let value = evaluateSeqExpression([
            ['text', 'A'],
            ['literal', { type: 'boolean', value: false }]
        ], dynamicState, context);
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({
            text: 'A'
        });
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['evaluateAndMergeArrayOfScenePartExpressions: Don\'t know how to handle value of type \'boolean\'.']);
    });

    it('evaluates and combines texts and options', () => {
        let value = evaluateSeqExpression([
            ['text', 'A'],
            ['text', 'B'],
            buildGotoOptionExpression('sceneC'),
            buildGotoOptionExpression('sceneD')
        ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({
            text: 'AB',
            options: [
                {text: 'Go to sceneC', action: 'goto', parameters: ['sceneC']},
                {text: 'Go to sceneD', action: 'goto', parameters: ['sceneD']}
            ]
        });
    });

    it('can merge text from scene parts', () => {
        let testText = 'Hello world.';
        let seq = ['seq',
            ['text', testText]
        ];
        let value = evaluateSeqExpression([ seq ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({
            text: testText
        });
    });

    it('can merge options from scene parts', () => {
        const nextSceneId = 'sceneC';
        let seq = ['seq',
            buildGotoOptionExpression(nextSceneId)
        ];
        let value = evaluateSeqExpression([ seq ], dynamicState, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({
            options: [
                {text: 'Go to ' + nextSceneId, action: 'goto', parameters: [nextSceneId]}
            ]
        });
    });

    it('can merge dynamic state from scene parts', () => {
        let { vars, setCommand, expectedVars } = setUpSetCommandAndVars();
        let seq = ['seq',
            setCommand
        ];
        let value = evaluateSeqExpression([ seq ], {vars: vars}, context);
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({
            dynamicState: {vars: expectedVars}
        });
    });

    it('propagates changes to game state', () => {
        let { vars, setCommand, expectedVars } = setUpSetCommandAndVars();
        let testText = 'Hello world.';
        let value = evaluateSeqExpression([
                ['text', testText],
                setCommand
            ],
            {vars: vars},
            context
        );
        expect(reportError).toNotHaveBeenCalled();
        expect(value.type).toEqual('scenePart');
        expect(value.value).toEqual({
            text: testText,
            dynamicState: {vars: expectedVars}
        });
    });
});
