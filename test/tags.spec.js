import expect from 'expect';
import { getRandomlySelectedItemIndexByTags } from '../src/tags';
import { setUpDynamicStateAndContextAndReportErrorSpy } from './testHelpers';


describe('tagged item handling', () => {
    let dynamicState, context, reportError;

    beforeEach('set up common test variables', function() {
        ({dynamicState, context, reportError} = setUpDynamicStateAndContextAndReportErrorSpy());
    });

    it('deals with a bad collection', () => {
        let foundBlock = getRandomlySelectedItemIndexByTags(undefined, [], dynamicState, context);
        expect(foundBlock).toBe(undefined);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Expected an object or array as the collection, got undefined.']);
    });

    it('deals with bad desired tags', () => {
        let foundBlock = getRandomlySelectedItemIndexByTags({}, undefined, dynamicState, context);
        expect(foundBlock).toBe(undefined);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Expected an array as the desired tags, got undefined.']);
    });

    it('deals with no desired tags', () => {
        let foundBlock = getRandomlySelectedItemIndexByTags({}, [], dynamicState, context);
        expect(foundBlock).toBe(undefined);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Desired tag array was empty.']);
    });

    it('finds a block with one tag', () => {
        const block = {
            tags: ['a'],
            content: []
        };
        let foundBlock = getRandomlySelectedItemIndexByTags({'aBlock': block}, ['a'], dynamicState, context);
        expect(foundBlock).toBe('aBlock');
        expect(reportError).toNotHaveBeenCalled();
    });

    it('finds a block in an array', () => {
        const block = {
            tags: ['a'],
            content: []
        };
        let foundBlock = getRandomlySelectedItemIndexByTags([block], ['a'], dynamicState, context);
        expect(foundBlock).toBe(0);
        expect(reportError).toNotHaveBeenCalled();
    });

    it('finds a block with one tag of several', () => {
        const block = {
            tags: ['a', 'b'],
            content: []
        };
        let foundBlock = getRandomlySelectedItemIndexByTags({'aBlock': block}, ['a'], dynamicState, context);
        expect(foundBlock).toBe('aBlock');
        expect(reportError).toNotHaveBeenCalled();
    });

    it('finds a block with multiple tags', () => {
        const block = {
            tags: ['a', 'b'],
            content: []
        };
        let foundBlock = getRandomlySelectedItemIndexByTags({'aBlock': block}, ['a', 'b'], dynamicState, context);
        expect(foundBlock).toBe('aBlock');
        expect(reportError).toNotHaveBeenCalled();
    });

    it('finds a block with multiple tags of several', () => {
        const block = {
            tags: ['a', 'b', 'c'],
            content: []
        };
        let foundBlock = getRandomlySelectedItemIndexByTags({'aBlock': block}, ['a', 'b'], dynamicState, context);
        expect(foundBlock).toBe('aBlock');
        expect(reportError).toNotHaveBeenCalled();
    });

    it('does not find a block with tags that don\'t exist', () => {
        const block = {
            tags: ['a', 'b', 'c'],
            content: []
        };
        let foundBlock = getRandomlySelectedItemIndexByTags({'aBlock': block}, ['d', 'e'], dynamicState, context);
        expect(foundBlock).toBe(undefined);
        expect(reportError).toNotHaveBeenCalled();
    });
});
