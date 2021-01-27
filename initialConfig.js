const config = () => ({
    redisHost: undefined,
    ClientId: undefined,
    ClientSecret: undefined,
    spikeURL: undefined,
    tokenGrantType: 'client_credentials',
    tokenAudience: undefined,
    tokenRedisKeyName: undefined,
    // path relative to current folder ( config )
    spikePublicKeyFullPath: undefined,
    useRedis: false,
    httpsValidation: false,
    hostHeader: false,
    retries: 3,
    sleepBetweenRetries: 500
})

// Configuration validation mapper, each field with required
// value true will be strictly validated and if forgotten or bad value was entered, throwing
// an error with indication for the problem.

// The mapping configuration goes like this:
/**
 * {
 *  field_name: {
 *      type (String):
 *          Type of the field in manner of `typeof` results.
 * 
 *      required (Boolean):
 *          Indicates if the field is required.
 * 
 *      dependsOn ({ fieldName: String, fieldValue: any} | undefined):
 *          Object containing field name which the current field is depends on and field
 *          value to check against.
 *          If the dependsOn field is included, the field becomes required.
 * 
 *      errorMessage (String | undefined):
 *          Error message to display when the field invalidates.
 *          If no error message was specified, using default missing field error message.
 *  }
 * }
 */
const configValidationMap = {
    redisHost: {
        type: 'string',
        required: false,
        dependsOn: { fieldName: 'useRedis', fieldValue: true }
    },
    tokenRedisKeyName: {
        type: 'string',
        required: false,
        dependsOn: { fieldName: 'useRedis', fieldValue: true }
    },
    clientId: {
        type: 'string',
        required: true
    },
    clientSecret: {
        type: 'string',
        required: true
    },
    spikeURL: {
        type: 'string',
        required: true
    },
    tokenAudience: {
        type: 'string',
        required: true
    },
    spikePublicKeyFullPath: {
        type: 'string',
        required: true,
    },
    useRedis: {
        type: 'boolean',
        required: false
    },
    httpsValidation: {
        type: 'boolean',
        required: false
    },
    hostHeader: {
        type: 'boolean',
        required: false
    },
    retries: {
        type: 'number',
        required: true
    },
    sleepBetweenRetries: {
        type: 'number',
        required: true
    }
};

module.exports = {
    config,
    configValidationMap
};