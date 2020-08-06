const config = () => ({
    redisHost: 'redis://localhost',
    ClientId: 'ClientId',
    ClientSecret: 'ClientSecret',
    spikeURL: 'http://localhost:8080',
    tokenGrantType: 'client_credentials',
    tokenAudience: 'kartoffel',
    tokenRedisKeyName: 'token',
    // path relative to current folder ( config )
    spikePublicKeyFullPath: './key.pem',
    useRedis: true,
    httpsValidation: false,
    hostHeader: false,
    logger: false,
    retries: false,
})

module.exports = config;