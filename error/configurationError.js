class ConfigurationError extends Error {

    constructor(message) {
        super(message || 'Configuration error, check your configuration.');

        this.name = this.constructor.name;
        this.stack = undefined;
    }
}

module.exports = ConfigurationError;