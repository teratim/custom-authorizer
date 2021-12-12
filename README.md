# Service-api-key

These are some really brief instructions for you to try and get a simple serverless framework demo working.

This small deployment shows the underpinning code required to create a custom authorizer which could be used to authorize API requests to a restricted API.

Instructions as follows:

1. Go to your AWS account and create a KMS key with admin privileges (I will show you how to do this!). Record the ARN somewhere because we will need it in a bit!

2. When you have done that go and create a Cloud9 instance and log in.

3. To deploy the serverless framework use npm as follows:

npm install -g serverless

4. Now clone the repository:

git clone https://github.com/teratim/custom-authorizer

5. Explore the code and add your KMS ARN to the keydata.yml file in the KMS directory.

6. You should be good to deploy the code now....go to the base of the code directory and deploy as follows:

sls deploy

6. Once the deployment has completed, you will find the endpoints which have been created for 

* createKey - used to create a new API key
* updateKeyState - used to update the key state
* getKeyDetails - to view the current key details

....record these and edit the curl statements below to include them..

7. If you have postman installed, the use it ....its much nicer and makes sense in the long run. However, in the interest of time, you can run the following commands from the command line to create, get and update your keys:

## createKey

To run a createKey from the command line, use the following:

        curl --location --request POST '<ENTER YOUR createKey endpoint here>' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "userName":"YOUR_NAME",
            "orgName": "A_SAMPLE_ORG",
            "companyName": "A_SAMPLE_COMPANY"
        }'

## updateKeyState

To run an updateKeyState from the command line, use the following:

        curl --location --request POST '<ENTER YOUR updateKeyState endpoint here>' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "accessKeyName": "<ENTER YOUR ACCESSKEYNAME FROM THE CREATEKEY COMMAND OUTPUT HERE!>",
            "keyState": "ACTIVE"
        }'

## getKeyDetails

        To run a getKeyDetails from the command line, use the following:

        curl --location --request POST '<ENTER YOUR updateKeyState endpoint here>' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "accessKeyName":"<ENTER YOUR ACCESSKEYNAME FROM THE CREATEKEY COMMAND OUTPUT HERE!>"
        }'

