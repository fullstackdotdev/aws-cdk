import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class LambdaWithNoTriggersStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * deploying a lambda function without any triggers
     */
    new lambda.Function(this, 'LambdaWithNoTriggers', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lib/shared/lambda/dist/function.zip'),
      handler: 'index.handler',
      functionName: 'LambdaWithNoTriggers'
    });
  }
}
