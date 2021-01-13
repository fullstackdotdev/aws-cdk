import * as cdk from '@aws-cdk/core';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import dotenv from 'dotenv-safe';
import { EndpointType, LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { ServicePrincipal } from '@aws-cdk/aws-iam';
dotenv.config();

export class LambdaWithRestApiTriggerPatternConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define a Lambda Function with level-Pattern Construct
    const todoFunction = new Function(this, 'TodoFunction', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('lib/shared/lambda/dist/function.zip'),
      handler: 'index.handler',
      functionName: 'LambdaWithRestApiTriggerPatternConstruct'
    });

    // define a REST API with level-Pattern Construct
    const toDoRestApi = new LambdaRestApi(this, 'ToDoRestApi', {
      handler: todoFunction,
      restApiName: 'LambdaWithRestApiTriggerPatternConstruct',
      description: `A REST API created with Pattern constructs i.e, 
      CloudFormation Resources (Cfn) and deployed as a trigger for todoFunction lambda`,
      endpointConfiguration: {
        types: [EndpointType.EDGE]
      },
      deployOptions: { stageName: 'prod' },
      proxy: true
    });

    // define Resource policy to allow API-Gateway service for invoking lambda function
    todoFunction.addPermission('permission', {
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:us-east-1:${process.env.AWS_ACCOUNT_NUMBER}:${toDoRestApi.restApiId}/*/*/todos`,
      principal: new ServicePrincipal('apigateway.amazonaws.com', {})
    });
  }
}
