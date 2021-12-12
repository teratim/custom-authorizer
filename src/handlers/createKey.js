"use strict";

const middy = require("@middy/core");
const httpErrorHandler = require("@middy/http-error-handler");
const ApiKeyClient = require("../../lib/ApiKeyClient");

const createKey = async event => {
  if (typeof event.body.userName === 'undefined' || typeof event.body.orgName === 'undefined' || typeof event.body.companyName === 'undefined'){
    return {
      statusCode: 400,
      body: 'ERROR: Input parameters incorrect'
    }
  }
  let hashKey=new ApiKeyClient().generate_hash(event.body.companyName+event.body.orgName+event.body.userName);
  let randomKey=new ApiKeyClient().generate_randomkey(20);
  let ddb_record = {
    accessKeyName: hashKey+randomKey,
    apiKeyName: await new ApiKeyClient().generate_kmsencryption(process.env.APIKEY_KMS_KEY,event.body.companyName+event.body.orgName+event.body.userName),
    companyName: event.body.companyName,
    userName: event.body.userName,
    orgName: event.body.orgName,
    keyState: 'INACTIVE'
  }
  console.log('createKey - adding key: ',ddb_record);
  let get_key_record = await new ApiKeyClient().getApiKey(ddb_record.apiKeyName);
  if (typeof get_key_record.Item === 'undefined'){
    //then no existing key!
    await new ApiKeyClient().createApiKey(ddb_record);
    let create_key_record = await new ApiKeyClient().getApiKey(ddb_record.apiKeyName);
    if (typeof create_key_record.Item === 'undefined'){
      return {
        statusCode: 401,
        body: 'ERROR: Unsuccessful key addition to database!'
      }
    }
    else {
      return {
        statusCode: 200,
        body: create_key_record.Item
      }
    }
  }
  else {
    return {
      statusCode: 400,
      body: 'ERROR: Key exists already for these credentials!'
    }
  }
};

const handler = middy(createKey)
  .use(httpErrorHandler());

module.exports = {
  createKey,
  handler
};