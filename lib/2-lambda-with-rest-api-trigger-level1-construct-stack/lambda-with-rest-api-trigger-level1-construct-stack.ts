import * as cdk from '@aws-cdk/core';
import {
  CfnDeployment,
  CfnMethod,
  CfnResource,
  CfnRestApi
} from '@aws-cdk/aws-apigateway';
import { CfnFunction, CfnPermission } from '@aws-cdk/aws-lambda';
import { CfnRole } from '@aws-cdk/aws-iam';
import dotenv from 'dotenv-safe';
dotenv.config();

export class LambdaWithRestApiTriggerL1ConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define a role for lambda with trusted execution permissions
    const todoFunctionRole = new CfnRole(this, 'TodoFunctionRole', {
      assumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com'
            }
          }
        ]
      },
      description:
        'Lambda execution role for LambdaWithRestApiTriggerL1ConstructExecutionRole stack',
      roleName: 'LambdaWithRestApiTriggerL1ConstructExecutionRole',
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      ]
    });

    // define a lambda function with level-L1 Construct
    const todoFunction = new CfnFunction(this, 'TodoFunction', {
      code: {
        s3Bucket: 'fullstack-dev-lambda-package',
        s3Key: 'function.zip'
      },
      role: todoFunctionRole.attrArn,
      runtime: 'nodejs12.x',
      handler: 'index.handler',
      functionName: 'LambdaWithRestApiTriggerL1Construct'
    });

    const triggerRestApi = new CfnRestApi(this, 'TriggerRestApi', {
      name: 'LambdaWithRestApiTriggerL1Construct',
      description:
        'A REST API created with L1 constructs i.e, CloudFormation Resources (Cfn) and deployed as a trigger for todoFunction lambda'
    });

    const triggerRestApiResource = new CfnResource(
      this,
      'TriggerRestApiResource',
      {
        parentId: triggerRestApi.attrRootResourceId,
        pathPart: 'todos',
        restApiId: triggerRestApi.ref
      }
    );

    const triggerRestApiMethod = new CfnMethod(this, 'TriggerRestApiMethod', {
      httpMethod: 'GET',
      restApiId: triggerRestApi.ref,
      resourceId: triggerRestApiResource.ref,
      authorizationType: 'NONE',
      methodResponses: [
        {
          statusCode: '200'
        }
      ],
      integration: {
        type: 'AWS',
        integrationHttpMethod: 'POST',
        uri: `arn:aws:apigateway:us-east-1:lambda:path/2015-03-31/functions/${todoFunction.attrArn}/invocations`,
        integrationResponses: [
          {
            statusCode: '200'
          }
        ]
      }
    });

    new CfnPermission(this, 'TodoFunctionResourcePolicy', {
      action: 'lambda:InvokeFunction',
      functionName: todoFunction.ref,
      principal: 'apigateway.amazonaws.com',
      sourceArn: `arn:aws:execute-api:us-east-1:${process.env.AWS_ACCOUNT_NUMBER}:${triggerRestApi.ref}/*/*/todos`
    });

    new CfnDeployment(this, 'TriggerRestApiDeployment', {
      stageName: 'prod',
      restApiId: triggerRestApi.ref
    }).addDependsOn(triggerRestApiMethod);
  }
}
