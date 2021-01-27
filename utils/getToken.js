/* eslint-disable require-atomic-updates */
const njwt = require("njwt");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
const sleep = require("./sleep");
const validateConfig = require("./validateConfig");

const initialOptions = require("../initialConfig").config();

const getTokenCreator = (options) => {
    // saves token for this function instance
    let token = null;

    const actualOptions = { ...initialOptions, ...options };
    let { ClientId, ClientSecret, spikeURL, tokenGrantType, tokenAudience, tokenRedisKeyName,
    spikePublicKeyFullPath, useRedis, redisHost, httpsValidation, hostHeader, retries = 3, sleepBetweenRetries = 500 } = actualOptions;

    // For convenience - people can make mistakes
    spikeURL = actualOptions.spikeUrl || spikeURL; 
    ClientId = actualOptions.clientId || ClientId;
    ClientSecret = actualOptions.clientSecret || ClientSecret;

    // Validate configuration fields
    validateConfig({ ...actualOptions, spikeURL, clientId: ClientId, clientSecret: ClientSecret });

    const base64 = data => (new Buffer(data)).toString('base64');


    const getSigningKey = function () {
        if (this.key)
            return this.key;        
        this.key = fs.readFileSync(spikePublicKeyFullPath, 'utf8');
        return this.key;
    };

    const generateSpikeAuthorizationHeaders = () => ({
        'Authorization': `Basic ${base64(ClientId + ":" + ClientSecret)}`,
        'Content-Type': 'application/json',
        ...(hostHeader ? { 'Host': spikeURL.split('/')[2] } : {})
    });

    const generateSpikeBodyParams = () => ({
        'grant_type': tokenGrantType,
        'audience': tokenAudience,
    });

    const handleTokenFromSpike = async () => {
        const headers = generateSpikeAuthorizationHeaders();
        const body = generateSpikeBodyParams();
        const httpsAgent = !httpsValidation ? { httpsAgent: new https.Agent({ rejectUnauthorized: false })} : {};

        try {
            const { data } = await axios.post(spikeURL, { ...body }, { headers, ...httpsAgent });
            if (!data)
                return { err: 'No reponse from Spike' };
            const { access_token } = data;
            if (useRedis) {
                const { redisClient } = require(path.resolve(__dirname, "./redisHandler"));
                const { setValue } = redisClient(redisHost);
                await setValue(tokenRedisKeyName, access_token);
            }
            return { newToken: access_token };
        }
        catch (err) { return { err } }
    }

    const isValid = unvalidatedToken => {
        return new Promise(async (resolve, reject) => {
            if (unvalidatedToken) {
                njwt.verify(unvalidatedToken, await getSigningKey(), 'RS256', (err, verified) => {
                    if (err)
                        return resolve(false);
                    return resolve(true);
                })
            }
            else
                resolve(false);
        })
    }

    let getTokenFromRedis;
    if (useRedis) {
        const { redisClient } = require(path.resolve(__dirname, "./redisHandler"));
        const { getValue } = redisClient(redisHost);

        getTokenFromRedis = async () => {
            try {
                const redisToken = await getValue(tokenRedisKeyName);
                if (await isValid(redisToken))
                    return { redisToken };
            }
            catch (err) { return { err } }
            return { err: 'Invalid token from redis' };
        };
    }

    const redisResponse = async () => {
        const { err: redisError, redisToken } = useRedis ? await getTokenFromRedis() : {};
        if (redisToken) {
            return redisToken;
        }
        redisError ? console.error(`redisError: ${redisError}`) : null;
        return null;
    }

    const spikeResponse = async () => {
        const { err: spikeError, newToken } = await handleTokenFromSpike();
        if (newToken) {
            return newToken;
        }
        spikeError ? console.error(`spikeError: ${spikeError}`) : null;
        return null;
    }

    const getAndSaveNewToken = async (retries) => {
        if (retries) {
            return (await redisResponse()) ? (await redisResponse()) : (await spikeResponse()) ? (await spikeResponse())
             : (await sleep(sleepBetweenRetries), await getAndSaveNewToken(retries - 1));
        }
        throw new Error('failed getting spike token');
    }

    async function getToken() {
        if (await isValid(token))
            return token;
        token = await getAndSaveNewToken(retries);
        return token;
    }

    return getToken;
};



module.exports = { getTokenCreator };