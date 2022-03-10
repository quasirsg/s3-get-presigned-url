'use strict';

const S3 = require('aws-sdk/clients/s3');
const BUCKET_NAME = process.env.BUCKET_NAME;
const s3 = new S3();

module.exports.generatePresignedUrl = async event => {

  try {
    let body = JSON.parse(event.body)
    let objectKey = body.objectKey
    let s3Action = body.s3Action  //get/put etc
    let contentType = body.contentType
    let expirationTime = 60  //1 min to test

    console.log(`BucketName: ${BUCKET_NAME}, ObjectKey: ${objectKey}, S3Action: ${s3Action}, expirationTime: ${expirationTime}, contentType: ${contentType}`)
    
    let params = {
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Expires: expirationTime,
    }

    if (s3Action === 'putObject') {
      params.ContentType = contentType

      expiration = 60 * 5
      params.Expires = expiration

    }

    const signedUrl = s3.getSignedUrl(s3Action, params);

    return {
      statusCode: 200,
      body: JSON.stringify(signedUrl)
    };


  }
  catch(error) {
    console.log(`Error: ${error}`)
    return {
      statusCode: 500,
      body: 'Some error occurred..please check the logs',
    };
  }


  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};