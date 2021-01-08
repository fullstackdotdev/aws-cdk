import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class NoSourceLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // defines an AWS Lambda resource
    new lambda.Function(this, 'SourceIsUnknown', {
      runtime: lambda.Runtime.NODEJS_12_X, // execution environment
      code: lambda.Code.fromAsset('lib/nosource-lambda/dist'), // code loaded from "lambda" directory
      handler: 'index.handler' // file is "hello", function is "handler"
    });
  }
}
