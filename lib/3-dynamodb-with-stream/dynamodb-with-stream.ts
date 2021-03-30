import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambdaEventSource from '@aws-cdk/aws-lambda-event-sources';
import * as iam from '@aws-cdk/aws-iam';
import { RemovalPolicy } from '@aws-cdk/core';

/**
 * @description DynamoDB with streams enabled and lambda as a trigger
 * @author Shirish Munukuntla
 */
export class DynamoDBWithStreamStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda function 👈🏽
    const func = new lambda.Function(this, 'LambdaStream', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(
        'lib/3-dynamodb-with-stream/lambda/dist/function.zip'
      ),
      handler: 'index.handler',
      functionName: 'LambdaStream',
      initialPolicy: [
        new iam.PolicyStatement({
          actions: ['dynamodb:*', 'sns:*'],
          resources: ['*']
        })
      ]
    });

    // dynamodb table with streams enabled 👈🏽
    const ddbTable = new dynamodb.Table(this, 'DynamoDBWithStream', {
      tableName: 'UserProfile',
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING
      }
    });

    // define dynamodb stream as source event for lambda 👈🏽
    func.addEventSource(
      new lambdaEventSource.DynamoEventSource(ddbTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        enabled: true
      })
    );
  }
}
