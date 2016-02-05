import expect from 'expect';
import { nullValue,
         isValidValue,
         isTrueValue,
         isNullValue } from '../src/types';


describe('isValidValue', () => {
    let reportError;

    beforeEach('set up common test variables', function() {
        reportError = expect.createSpy();
    });

    it('deals with the value not being an object', () => {
        let isValid = isValidValue(0, reportError);
        expect(isValid).toBe(false);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Value is not an object.']);
    });

    it('deals with the value not having a type field', () => {
        let isValid = isValidValue({value: 0}, reportError);
        expect(isValid).toBe(false);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Value is missing type field.']);
    });

    it('deals with the value not having a value field', () => {
        let isValid = isValidValue({type: 'integer'}, reportError);
        expect(isValid).toBe(false);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Value is missing value field.']);
    });

    it('deals with the value not having a recognized type', () => {
        const wrongType = 'YARGLA';
        let isValid = isValidValue({type: wrongType, value: 0}, reportError);
        expect(isValid).toBe(false);
        expect(reportError.calls.length).toEqual(1);
        expect(reportError.calls[0].arguments).toEqual(['Value type \'' + wrongType + '\' is not a recognized type.']);
    });

    it('correctly validates a valid value', () => {
        let isValid = isValidValue({type: 'integer', value: 0}, reportError);
        expect(isValid).toBe(true);
        expect(reportError).toNotHaveBeenCalled();
    });
});


describe('isTrueValue', () => {
    it('correctly recognizes a true value', () => {
        let isTrue = isTrueValue({type: 'boolean', value: true});
        expect(isTrue).toBe(true);
    });

    it('correctly recognizes a false value', () => {
        let isTrue = isTrueValue({type: 'boolean', value: false});
        expect(isTrue).toBe(false);
    });

    it('correctly recognizes a non-boolean value', () => {
        let isTrue = isTrueValue({type: 'string', value: 'a'});
        expect(isTrue).toBe(false);
    });
});


describe('isNullValue', () => {
    it('correctly recognizes a null value ', () => {
        let isNull = isNullValue({type: 'null', value: undefined});
        expect(isNull).toBe(true);
    });

    it('correctly recognizes a non-null value', () => {
        let isNull = isNullValue({type: 'integer', value: 0});
        expect(isNull).toBe(false);
    });

    it('correctly recognizes nullValue', () => {
        let isNull = isNullValue(nullValue);
        expect(isNull).toBe(true);
    });
});
