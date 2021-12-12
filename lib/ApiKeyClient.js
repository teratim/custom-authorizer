"use strict";

const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();
const KMS = new AWS.KMS({ region: process.env.AWS_REGION });
const crypto = require('crypto');

module.exports = class ApiKeyClient {

    createApiKey = async (rec) => {
      const params = {
        TableName: process.env.APIKEY_TABLE_NAME,
        Item: rec
      };
      return await dynamodb.put(params).promise();
    }

    deleteApiKey = async (hashKeyName) => {
      const params = {
        TableName: process.env.APIKEY_TABLE_NAME,
        Key: {
          'hashKeyName':hashKeyName,
        }
      };
      return await dynamodb.delete(params).promise();
    }

    getApiKey = async (apiKeyName) => {
      const params = {
        TableName: process.env.APIKEY_TABLE_NAME,
        Key: {apiKeyName}
      };
      return await dynamodb.get(params).promise();
    }

    getApiRecordFromAccessKey = async (accessKeyName) => {
      const params = {
        TableName: process.env.APIKEY_TABLE_NAME,
        IndexName: 'accessKeyIndex',
        KeyConditionExpression: 'accessKeyName = :acc_name',
        ExpressionAttributeValues: { ':acc_name': accessKeyName } 
      };
      return await dynamodb.query(params).promise();
    }

    updateApiKeyState = async (apiKeyName,mystate) => {
      const params = {
        TableName: process.env.APIKEY_TABLE_NAME,
        Key: {apiKeyName},
        UpdateExpression: 'set keyState = :k',
        ExpressionAttributeValues: {
          ':k': mystate,
        },
      };
      return await dynamodb.update(params).promise();
    }

    generate_hash = (mystr) => {
      let hash = crypto.createHash('md5').update(mystr).digest('hex');
      return hash;
    }

    generate_kmsencryption = async (keyid, mystr) => {
      const encParams = {
        KeyId: keyid,
        Plaintext: mystr
      };
      const encryptedKMSData = await KMS.encrypt(encParams).promise();
      return encryptedKMSData.CiphertextBlob.toString("base64")
    }

    generate_randomkey = (bits) => {
      let id = crypto.randomBytes(bits).toString('hex');
      return id;
    }
}