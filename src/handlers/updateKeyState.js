"use strict";

const middy = require("@middy/core");
const httpErrorHandler = require("@middy/http-error-handler");
const ApiKeyClient = require("../../lib/ApiKeyClient");

const updateKeyState = async event => {
  if (typeof event.body.accessKeyName === 'undefined' || event.body.keyState === 'undefined' ){
    return {
      statusCode: 400,
      body: 'ERROR: Input parameters incorrect'
    }
  }
  if (event.body.keyState !== 'ACTIVE' && event.body.keyState !== 'INACTIVE'){
    return {
      statusCode: 401,
      body: 'ERROR: keyState parameter should be either ACTIVE or INACTIVE'
    }
  }
  //let hashKeyName = new ApiKeyClient().generate_hash(event.body.companyName+event.body.orgName+event.body.userName);
  //console.log('updateKeyState - adding key: ',hashKeyName);
  let key_record = await new ApiKeyClient().getApiRecordFromAccessKey(event.body.accessKeyName);
  console.log('updateKey - returns: ',key_record);
  if (typeof key_record.Items === 'undefined'){
    return {
      statusCode: 402,
      body: 'ERROR: Key details not found!'
    }
  }
  else {
    if (key_record.Items[0].keyState === event.body.keyState){
      return {
        statusCode: 403,
        body: 'ERROR: Key already exists in specified state!'
      }
    }
    else {
      await new ApiKeyClient().updateApiKeyState(key_record.Items[0].apiKeyName,event.body.keyState);
      return {
        statusCode: 200,
        body: 'INFO: Key state updated!'
      }
    }
  }
};

const handler = middy(updateKeyState)
  .use(httpErrorHandler());

module.exports = {
  updateKeyState,
  handler
};