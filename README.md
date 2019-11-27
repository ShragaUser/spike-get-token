# [Spike](https://github.com/rabiran/OSpike) npm module: "spike-get-token"

This REPO is a Spike npm module that can be used to recieve oAuth tokens from Spike OAuth2 authorization server. 


### Install
```
npm install spike-get-token
```

### Usage

```js
const getTokenCreator = require("spike-get-token");
const getToken = getTokenCreator(options);

// get token
const token = getToken();

/** use token however ... 
......................**/
```

### Options For getTokenCreator

* _redisHost_: url to redis host 
* _ClientId_: Spike given ClientId 
* _ClientSecret_: Spike given ClientSecret 
* _spikeURL_: url to Spike server instance 
* _apiURL_: url to api that requires Spike access_token
* _tokenGrantType_: type of grant requested from Spike for the access_token
* _tokenAudience_: access_token audience ( same as api )
* _tokenRedisKeyName_: key to save token in redis
* _spikePublicKeyRelativePath_: path to Spike public key for jwt verification ( relative to [```./config/```](./config))
* _useRedis_: (Boolean) set to true if usage of redis is required








