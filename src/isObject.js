export default function isObject(_value) {
    return !!_value && (typeof _value === 'object') && !Array.isArray(_value);
}
