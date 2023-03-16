const errorMessages = {
    // string errors
    'string.base': '{#label} should be a string',
    'string.empty': '{#label} should not be empty',
    'string.min': '{#label} should have at least {#limit} characters',
    'string.max': '{#label} should have at most {#limit} characters',
    'string.length': '{#label} should have exactly {#limit} characters',
    'string.email': '{#label} should be a valid email',
    'string.pattern.base': '{#label} does not match the required pattern',
    'string.isoDate': '{#label} should be a valid ISO 8601 date',
    'string.hostname': '{#label} should be a valid hostname',
    'string.hex': '{#label} should only contain hexadecimal characters',
    'string.guid': '{#label} should be a valid GUID',
    'string.uri': '{#label} should be a valid URI',

    // number errors
    'number.base': '{#label} should be a number',
    'number.min': '{#label} should be at least {#limit}',
    'number.max': '{#label} should be at most {#limit}',
    'number.less': '{#label} should be less than {#limit}',
    'number.greater': '{#label} should be greater than {#limit}',

    // boolean errors
    'boolean.base': '{#label} should be a boolean',

    // object errors
    'object.base': '{#label} should be an object',
    'object.missing': '{#label} is missing required fields',
    'object.unknown': '{#label} has unknown fields',
    'object.and': 'Either {#present} or {#missing} is required',
    'object.or': 'Either {#present} or {#missing} is required',
    'object.nand': '{#main} should not exist simultaneously with {#peers}',
    'object.xor': 'Either {#peer1} or {#peer2} is required',

    // date errors
    'date.base': '{#label} should be a date',
    'date.min': '{#label} should be after {#limit}',
    'date.max': '{#label} should be before {#limit}',

    // array errors
    'array.base': '{#label} should be an array',
    'array.min': '{#label} should have at least {#limit} items',
    'array.max': '{#label} should have at most {#limit} items',
    'array.length': '{#label} should have exactly {#limit} items',
    'array.unique': '{#label} should not have duplicate values',

    // any errors
    'any.required': '{#label} is required',
    'any.unknown': '{#label} is not allowed',
    'any.only': '{#label} must be {#valids}',
    'any.default': '{#label} value is not valid',
    'any.empty': '{#label} cannot be empty',
    'any.invalid': '{#label} contains an invalid value',
    'any.custom': '{#label} validation failed with error: {#error}',
    'any.type': '{#label} must be of type {#type}',
    'any.ref': '{#label} must be a reference to another field',
    'any.concat': '{#label} failed to concatenate with value {#value}',
    'any.failover': '{#label} validation failed with failover value {#failover}',
    'any.default': '{#label} value is not valid',

};



module.exports = errorMessages;