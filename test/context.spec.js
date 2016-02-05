import expect from 'expect';
import { buildContext,
         isValidContext,
         getRandomInt } from '../src/context';


describe('buildContext', () => {
    it('builds a valid context', () => {
        const context = buildContext();
        expect(context.reportError).toExist();
    });
});


describe('isValidContext', () => {
    it('deals with the context not being an object', () => {
        let { isValid, errorMessages } = isValidContext(0);
        expect(isValid).toBe(false);
        expect(errorMessages).toEqual(['Context is not an object.']);
    });

    it('deals with the context missing certain properties', () => {
        let context = buildContext();
        delete context.reportError;
        delete context.expressionEvaluators;
        let { isValid, errorMessages } = isValidContext(context);
        expect(isValid).toBe(false);
        expect(errorMessages).toEqual(['Context is missing reportError property.',
            'Context is missing expressionEvaluators property.']);
    });

    it('correctly validates a valid context', () => {
        let context = buildContext();
        let { isValid, errorMessages } = isValidContext(context);
        expect(isValid).toBe(true);
        expect(errorMessages).toEqual([]);
    });
});


describe('getRandomInt', () => {
    it('deals with a bad context parameter', () => {
        expect(function() {
            getRandomInt(undefined);
        }).toThrow('getRandomInt: _context parameter is not an object.');
    });

    it('deals with a bad upper bound parameter', () => {
        const context = buildContext();
        expect(function() {
            getRandomInt(context);
        }).toThrow('getRandomInt: _upper parameter is not a number.');
    });

    it('deals with a range of zero', () => {
        const context = buildContext();
        let randomValue = getRandomInt(context, 0);
        expect(randomValue).toBe(0);
    });

    it('returns a random number that is at the bottom of the given range', () => {
        const context = buildContext({
            _rng: function() { return 0; }
        });
        let randomValue = getRandomInt(context, 100);
        expect(randomValue).toBe(0);
    });

    // TODO: File an issue in random-js.
    // it('returns a random number that is at the top of the given range', () => {
    //     const context = buildContext({
    //         // Maximum value in 32 bits.
    //         // See https://github.com/ckknight/random-js#how-does-randomjs-alleviate-these-problems
    //         // Anything higher than 0xffffff00 causes both random-js and mocha to hang.
    //         _rng: function() { return 0xffffff00; }
    //     });
    //     let randomValue = getRandomInt(context, 100);
    //     expect(randomValue).toBe(100);
    // });
});
