import isString from 'lodash/isString';
import { getRandomlySelectedItemIndexByTags,
         getRandomlySelectedItemIndicesByTags } from '../tags';
import { nullValue } from '../types';
import { evaluateExpression,
         evaluateExpressionThatResultsInText } from './expression';


export function evaluateTags(_tags, _dynamicState, _context) {
    let tags = [];

    if (Array.isArray(_tags)) {
        tags = _tags.map(_tag => {
            if (isString(_tag)) {
                return _tag;
            }
            if (Array.isArray(_tag)) {
                return evaluateExpression(_tag, _dynamicState, _context).value;
            }
            _context.reportError('Tag \'' + _tag + '\' is neither a string nor an expression.');
            return undefined;
        })
        tags = tags.filter(_tag => _tag);
    } else {
        _context.reportError('Expected an array as the tag list, got ' + typeof(_tags) + '.');
    }

    return tags;
}

export function evaluateInjectOptionExpression(_parameters, _dynamicState, _context) {
    const tags = evaluateTags(_parameters, _dynamicState, _context);
    if (tags.length > 0) {
        let sceneId = getRandomlySelectedItemIndexByTags(_context.scenes, tags, _dynamicState.tagState, _context);
        if (sceneId) {
            // TODO: Double-check that collection has found item.
            // TODO: Maybe abstract away access of item.
            const sceneDesc = _context.scenes[sceneId];
            if (sceneDesc.hasOwnProperty('leadIn')) {
                const leadInText = evaluateExpressionThatResultsInText(sceneDesc['leadIn'], _dynamicState, _context);
                if (leadInText.length > 0) {
                    return {
                        type: 'options',
                        value: [{
                            text: leadInText,
                            action: 'goto',
                            parameters: [sceneId]
                        }]
                    };
                } else {
                    _context.reportError('Scene has empty lead-in.');
                    return nullValue;
                }
            } else {
                _context.reportError('Scene has no lead-in field.');
            }
        } else {
            _context.reportError('Could not find any scenes with tags ' + tags + '.');
        }
    } else {
        _context.reportError('Desired tag list was or evaluated to empty.');
    }

    return nullValue;
}

export function evaluateInjectBlockExpression(_parameters, _dynamicState, _context) {
    const tags = evaluateTags(_parameters, _dynamicState, _context);
    if (tags.length > 0) {
        let blockIndex = getRandomlySelectedItemIndexByTags(_context.blocks, tags, _dynamicState.tagState, _context);
        if (blockIndex !== undefined) {
            // TODO: Double-check that collection has found item.
            // TODO: Either turn blocks into array or abstract away access of item.
            const block = _context.blocks[blockIndex];
            if (block.hasOwnProperty('content')) {
                return evaluateExpression(block['content'], _dynamicState, _context);  
            } else {
                _context.reportError('Block has no content field.');
            }
        } else {
            _context.reportError('Could not find any blocks with tags ' + tags + '.');
        }
    } else {
        _context.reportError('Desired tag list was or evaluated to empty.');
    }

    return nullValue;
}
