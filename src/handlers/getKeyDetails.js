"use strict";

const middy = require("@middy/core");
const httpErrorHandler = require("@middy/http-error-handler");
const ApiKeyClient = require("../../lib/ApiKeyClient");

const getKeyDetails = async event => {
  if (typeof event.body.accessKeyName === 'undefined' ){
    return {
      statusCode: 400,
      body: 'ERROR: Input parameters incorrect'
    }
  }
  let key_record = await new ApiKeyClient().getApiRecordFromAccessKey(event.body.accessKeyName);
  if (typeof key_record.Items === 'undefined'){
    return {
      statusCode: 400,
      body: 'ERROR: Key details not found!'
    }
  }
  else {
    let returnobj = {
      accessKeyName : key_record.Items[0].accessKeyName,
      companyName : key_record.Items[0].companyName,
      userName: key_record.Items[0].userName,
      keyState: key_record.Items[0].keyState,
      orgName: key_record.Items[0].orgName
    }
    return {
        statusCode: 200,
        body: returnobj
    };
  }
};

const handler = middy(getKeyDetails)
  .use(httpErrorHandler());

module.exports = {
  getKeyDetails,
  handler
};