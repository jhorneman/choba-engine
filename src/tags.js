import Random from 'random-js';
import isObject from './isObject';
import forEach from 'lodash/forEach';
import forOwn from 'lodash/forOwn';
import difference from 'lodash/difference';


export function tagsAreMatched(_desiredTags, _availableTags) {
    // difference "creates an array of unique array values not included in the other provided arrays".
    // So if all desired tags are found among the available tags, the length of this new array is 0.
    return (difference(_desiredTags, _availableTags).length === 0);
}


function keyFromDesiredTags(_desiredTags) {
    return _desiredTags.join('_');
}


export function getRandomlySelectedItemIndexByTags(_collection, _desiredTags, _tagState, _context) {
    let foundIndices = getRandomlySelectedItemIndicesByTags(_collection, _desiredTags, _tagState, _context, 1);
    return foundIndices ? foundIndices[0] : undefined;
}


export function getRandomlySelectedItemIndicesByTags(_collection, _desiredTags, _tagState, _context, _nrItemsToGet) {
    if (!isObject(_collection) && !Array.isArray(_collection)) {
        _context.reportError('Expected an object or array as the collection, got ' + typeof(_collection) + '.');
        return undefined;
    }

    if (!Array.isArray(_desiredTags)) {
        _context.reportError('Expected an array as the desired tags, got ' + typeof(_desiredTags) + '.');
        return undefined;
    }

    if (_desiredTags.length === 0) {
        _context.reportError('Desired tag array was empty.');
        return undefined;
    }

    // Iterate over the array or object, for items with matching tags, store the index or key.
    let deck = [];
    const iteratorFn = Array.isArray(_collection) ? forEach : forOwn;
    iteratorFn(_collection, (value, key) => {
        if (tagsAreMatched(_desiredTags, value.tags)) {
            deck.push(key);
        }
    });

    if (deck.length === 0) {
        // Nothing found, this is not an error, don't report.
        return undefined;
    }

    function buildNewDeckState() {
        Random.shuffle(_context['_rng'], deck);
        return {
            index: 0,
            shuffleTable: deck
        }
    }

    let deckKey = keyFromDesiredTags(_desiredTags),
        deckState = _tagState.hasOwnProperty(deckKey) ? _tagState[deckKey] : buildNewDeckState(),
        pickedIndices = [],
        nrItemsToGet = (_nrItemsToGet > deck.length) ? deck.length : _nrItemsToGet;

    while (nrItemsToGet > 0) {
        // Draw a card from the deck.
        let newIndex = deckState.shuffleTable[deckState.index];
        deckState.index += 1;
        if (deckState.index >= deck.length) {
            deckState = buildNewDeckState();
        }

        // If the card is not already in the deck, add it.
        if (pickedIndices.indexOf(newIndex) === -1) {
            pickedIndices.push(newIndex);
            nrItemsToGet -= 1;
        }
    }

    _tagState[deckKey] = deckState;

    return pickedIndices;
}
