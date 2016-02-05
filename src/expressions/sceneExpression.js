import { isValidContext } from '../context';
import { evaluateExpression } from './expression';


const defaultScene = {
    text: '',
    options: [],
    desc: undefined
}

function normalizeScene(_scene) {
    return Object.assign({}, defaultScene, _scene);
}

export function getEmptyScene() {
    return normalizeScene({});
}


export function evaluateScene(_sceneId, _dynamicState, _context) {
    let scene = getEmptyScene(),
        dynamicState = _dynamicState;

    let { isValid: contextIsValid, errorMessages: contextErrorMessages } = isValidContext(_context);
    if (!contextIsValid) {
        if (_context && _context.hasOwnProperty('reportError')) {
            contextErrorMessages.map(_message => _context.reportError(_message));
        }
        return {
            scene: scene,
            dynamicState: dynamicState
        };
    }

    if (_context.scenes.hasOwnProperty(_sceneId)) {
        const sceneDesc = _context.scenes[_sceneId];
        if (sceneDesc.hasOwnProperty('content')) {
            const value = evaluateExpression(
                sceneDesc['content'],
                dynamicState,
                _context
            );

            // Convert return value to scene.
            switch (value.type) {
                case 'scenePart': {
                    // Must normalize because we're not guaranteed to get back a full scene.
                    scene = normalizeScene(value.value);
                    if (scene.hasOwnProperty('dynamicState')) {
                        dynamicState = scene.dynamicState;
                        delete scene.dynamicState;
                    }
                    break;
                }
                case 'options': {
                    scene.options = value.value;
                    break;
                }
                case 'dynamicState': {
                    dynamicState = value.value;
                    break;
                }
                case 'string': {
                    scene.text = value.value;
                    break;
                }
                case 'null': {
                    break;
                }
                default: {
                    _context.reportError('evaluateScene: Don\'t know how to handle value of type \'' + value.type +'\'.');
                    break;
                }
            }

            // Add reference to scene descriptor.
            scene.desc = sceneDesc;

        } else {
            _context.reportError('Scene \'' + _sceneId + '\' has no content field.');
        }
    } else {
        _context.reportError('Unknown scene \'' + _sceneId + '\'.');
    }

    return {
        scene: scene,
        dynamicState: dynamicState
    };
}
