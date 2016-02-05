import includes from 'lodash/includes';
import isObject from './isObject';


const types = [
    'scenePart',
    'options',
    'dynamicState',
    'string',
    'integer',
    'boolean',
    'null'
];

export const nullValue = {
    type: 'null',
    value: undefined
};


export function isValidValue(_value, _reportError) {
    if (!isObject(_value)) {
        _reportError('Value is not an object.');
        return false;
    }
    if (!_value.hasOwnProperty('type')) {
        _reportError('Value is missing type field.');
        return false;
    }
    if (!_value.hasOwnProperty('value')) {
        _reportError('Value is missing value field.');
        return false;
    }
    if (!includes(types, _value.type)) {
        _reportError('Value type \'' +  _value.type + '\' is not a recognized type.');
        return false;
    }
    // TODO: Add per-type value checking (dig out code from previous version of types.js).
    return true;
}

export function isTrueValue(_value) {
    // This function assumes _value is valid.
    return (_value.type === 'boolean') && _value.value;
}

export function isNullValue(_value) {
    // This function assumes _value is valid.
    return (_value.type === 'null');
}

export function convertValueToText(_value, _reportError) {
    let result = '';

    switch (_value.type) {
        case 'scenePart': {
            if (_value.value.hasOwnProperty('dynamicState')) {
                _reportError('scenePart value contains dynamic state: this is not allowed.');
            }
            if (_value.value.hasOwnProperty('options')) {
                _reportError('scenePart value contains options: this is not allowed.');
            }
            if (_value.value.hasOwnProperty('text')) {
                result = _value.value['text'];
            } else {
                _reportError('scenePart value does not contain text: this is not allowed.');
            }
            break;
        }
        case 'string': {
            result = _value.value;
            break;
        }
        case 'integer': {
            result = _value.value.toString();
            break;
        }
        // It's OK to not catch everything, because the functions that call this check for an empty string
        // result.
    }

    return result;
}
