const ConfigurationError = require('../error/configurationError');
const configValidationMap = require('../initialConfig').configValidationMap;


/**
 * Validate each configuration field needed for the package is included.
 * If required field is missing, throwing an error.
 * 
 * @param {Object} config - Configuration values for the package
 */
const validateConfig = (config) => {

    // Default configuration error message
    const invalidFieldMessage = '`{FIELD_NAME}` value is missing or has a bad value rather than `{FIELD_TYPE}`\n';
    const invalidFieldMessageDependsOn = 
        '`{FIELD_NAME}` is missing or has bad value rather than `{FIELD_TYPE}`\n(You have turned on the `{DEPENDS_ON_FIELD_NAME}` but without `{FIELD_NAME}`)\n';

    // Gather all field names from the config validation map
    const fieldNames = Object.keys(configValidationMap);

    const invalidMessages = [];

    for (let fieldName of fieldNames) {

        // If the field is required, check it existence
        if (configValidationMap[fieldName].required) {

            if (typeof config[fieldName] !== configValidationMap[fieldName].type) {

                invalidMessages.push(
                    configValidationMap[fieldName].errorMessage ||
                    invalidFieldMessage
                        .replace('{FIELD_NAME}', fieldName)
                        .replace('{FIELD_TYPE}', configValidationMap[fieldName].type)
                );

                continue;
            }

        } else { // Field is not required, but maybe has bad type or depends on other field

            // Check if the field is depends on other field which mentioned but bad or missing value
            if (
                (typeof configValidationMap[fieldName].dependsOn === 'object') &&
                (
                    (
                        typeof config[configValidationMap[fieldName].dependsOn.fieldName] ===
                        configValidationMap[configValidationMap[fieldName].dependsOn.fieldName].type
                    ) &&
                    (
                        config[configValidationMap[fieldName].dependsOn.fieldName] ===
                        configValidationMap[fieldName].dependsOn.fieldValue
                    )
                ) &&
                (typeof config[fieldName] !== configValidationMap[fieldName].type)
            ) {

                invalidMessages.push(
                    configValidationMap[fieldName].errorMessage ||
                    invalidFieldMessageDependsOn
                        .replace(/\{FIELD_NAME\}/g, fieldName)
                        .replace('{FIELD_TYPE}', configValidationMap[fieldName].type)
                        .replace('{DEPENDS_ON_FIELD_NAME}', configValidationMap[fieldName].dependsOn.fieldName)
                );

                continue;
            }

            // Check if the field has bad type
            else if (
                config[fieldName] !== undefined &&
                typeof configValidationMap[fieldName].dependsOn === 'undefined' &&
                typeof config[fieldName] !== configValidationMap[fieldName].type
            ) {

                invalidMessages.push(
                    configValidationMap[fieldName].errorMessage ||
                    invalidFieldMessage
                        .replace('{FIELD_NAME}', fieldName)
                        .replace('{FIELD_TYPE}', configValidationMap[fieldName].type)
                );

                continue;
            }
        }
    }

    // If errors noticed, throw configuration error
    if (invalidMessages.length > 0) {
        throw new ConfigurationError('\n\n' + invalidMessages.join('\n') + '\n');
    }
}

module.exports = validateConfig;