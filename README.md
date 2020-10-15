# [Spike](https://github.com/rabiran/OSpike) npm module: "spike-get-token"

This REPO is a Spike npm module that can be used to recieve oAuth tokens from Spike OAuth2 authorization server. 

[![npm version](https://badge.fury.io/js/spike-get-token.svg)](https://badge.fury.io/js/spike-get-token)

[![NPM](https://nodei.co/npm/spike-get-token.png)](https://nodei.co/npm/spike-get-token/)

### Usage

```js
const getTokenCreator = require("spike-get-token");
const getToken = getTokenCreator(options);

// get token
const token = await getToken();

/** use token however ... 
......................**/
```

### Options For getTokenCreator

* _redisHost_: url to redis host 
* _ClientId_: Spike given ClientId 
* _ClientSecret_: Spike given ClientSecret 
* _spikeURL_: url to Spike server instance 
* _tokenGrantType_: type of grant requested from Spike for the access_token
* _tokenAudience_: access_token audience ( same as api )
* _tokenRedisKeyName_: key to save token in redis
* _spikePublicKeyFullPath_: path to Spike public key for jwt verification
* _useRedis_: (Boolean) set to true if usage of redis is required
* _httpsValidation_: (Boolean) set to true if you want to use https validation (default is false)
* _hostHeader_: (Boolean) add host header to the request (default is false)
* _retries_: (Number) amount of times to retry getting token (default is 3)
* _sleepBetweenRetries_: (Number) wait before doing next retry in milliseconds (default is 500)







