import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';

require('dotenv').config();

export default class AskHoffStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hoffHandler = new lambda.DockerImageFunction(this, 'HoffHandler', {
      functionName: `${id}-HoffHandler`,
      code: lambda.DockerImageCode.fromImageAsset('handlers/hoff'),
      environment: {
        MS_SECRET: process.env.MS_SECRET || '',
        GIPHY_TOKEN: process.env.GIPHY_TOKEN || '',
      },
    });

    // API Gateway
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hoffHandler,
    });
  }
}
