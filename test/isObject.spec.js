import expect from 'expect';
import isObject from '../src/isObject';


describe('isObject', () => {
    it('deals with an undefined value', () => {
        const isAnObject = isObject(undefined);
        expect(isAnObject).toBe(false);
    });

    it('deals with null', () => {
        const isAnObject = isObject(null);
        expect(isAnObject).toBe(false);
    });

    it('deals with an array', () => {
        const isAnObject = isObject([]);
        expect(isAnObject).toBe(false);
    });

    it('deals with an object', () => {
        const isAnObject = isObject({ what: 0 });
        expect(isAnObject).toBe(true);
    });

    it('deals with an empty object', () => {
        const isAnObject = isObject({});
        expect(isAnObject).toBe(true);
    });
});
