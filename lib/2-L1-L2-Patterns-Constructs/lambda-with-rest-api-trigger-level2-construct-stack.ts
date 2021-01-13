import * as cdk from '@aws-cdk/core';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import dotenv from 'dotenv-safe';
import {
  AuthorizationType,
  EndpointType,
  Integration,
  IntegrationType,
  Method,
  Resource,
  RestApi
} from '@aws-cdk/aws-apigateway';
import { ServicePrincipal } from '@aws-cdk/aws-iam';
dotenv.config();

export class LambdaWithRestApiTriggerL2ConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define a REST API with level-L2 Construct
    const toDoRestApi = new RestApi(this, 'ToDoRestApi', {
      restApiName: 'LambdaWithRestApiTriggerL2Construct',
      description: `A REST API created with L2 constructs i.e, 
      CloudFormation Resources (Cfn) and deployed as a trigger for todoFunction lambda`,
      endpointConfiguration: {
        types: [EndpointType.EDGE]
      },
      deployOptions: { stageName: 'prod' }
    });

    // define a Lambda Function with level-L2 Construct
    const todoFunction = new Function(this, 'TodoFunction', {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset('lib/shared/lambda/dist/function.zip'),
      handler: 'index.handler',
      functionName: 'LambdaWithRestApiTriggerL2Construct'
    });
    // define Resource policy to allow API-Gateway service for invoking lambda function
    todoFunction.addPermission('permission', {
      action: 'lambda:InvokeFunction',
      sourceArn: `arn:aws:execute-api:us-east-1:${process.env.AWS_ACCOUNT_NUMBER}:${toDoRestApi.restApiId}/*/*/todos`,
      principal: new ServicePrincipal('apigateway.amazonaws.com', {})
    });

    // define lambda function as backend integration for REST API
    const integration = new Integration({
      integrationHttpMethod: 'POST',
      type: IntegrationType.AWS,
      uri: `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${todoFunction.functionArn}/invocations`,
      options: {
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    });

    // define a resource like /todos for REST API end-point
    const resource = new Resource(this, 'resource', {
      parent: toDoRestApi.root,
      pathPart: 'todos'
    });

    // define a method like GET for resource like /todos on REST API end-point
    new Method(this, 'method', {
      httpMethod: 'POST',
      resource: resource,
      integration: integration,
      options: {
        authorizationType: AuthorizationType.NONE,
        methodResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    });
  }
}
