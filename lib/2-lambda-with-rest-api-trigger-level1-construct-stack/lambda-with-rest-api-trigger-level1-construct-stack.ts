import * as cdk from '@aws-cdk/core';
import {
  CfnDeployment,
  CfnMethod,
  CfnResource,
  CfnRestApi
} from '@aws-cdk/aws-apigateway';
import { CfnFunction, CfnPermission } from '@aws-cdk/aws-lambda';
import { CfnRole } from '@aws-cdk/aws-iam';

export class LambdaWithRestApiTriggerL1ConstructStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a role with lambda execution permissions
    const lambdaExecutionRole = new CfnRole(this, 'LambdaExecutionRole', {
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
      description: 'Lambda execution role',
      roleName: 'LambdaExecutionRole',
      managedPolicyArns: [
        'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
      ]
    });

    // define a lambda function with L1 Construct
    const todoFunction = new CfnFunction(this, 'L1ConstructAPILambda', {
      code: {
        s3Bucket: 'fullstack-dev-lambda-package',
        s3Key: 'function.zip'
      },
      role: lambdaExecutionRole.attrArn,
      runtime: 'nodejs12.x',
      handler: 'index.handler'
    });

    const sourceRestApi = new CfnRestApi(this, 'SourceApi', {
      name: 'L1ConstructAPI',
      description:
        'A REST API created with L1 constructs i.e, CloudFormation Resources (Cfn)'
    });

    const sourceRestApiResource = new CfnResource(this, 'SourceApiResource', {
      parentId: sourceRestApi.attrRootResourceId,
      pathPart: 'todos',
      restApiId: sourceRestApi.ref
    });
    // sourceRestApiResource.addDependsOn(sourceRestApi);

    const mymethod = new CfnMethod(this, 'SourceApiMethod', {
      httpMethod: 'GET',
      restApiId: sourceRestApi.ref,
      resourceId: sourceRestApiResource.ref,
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
            // responseTemplates: {
            //   'content-type': 'application/json'
            // }
          }
        ]
      }
    });
    // method.addDependsOn(sourceRestApi);

    new CfnPermission(this, 'LambdaResourcePolicy', {
      action: 'lambda:InvokeFunction',
      functionName: todoFunction.ref,
      principal: 'apigateway.amazonaws.com',
      sourceArn: `arn:aws:execute-api:us-east-1:328874933286:${sourceRestApi.ref}/*/*/todos`
    });
    // perm.addDependsOn(sourceRestApi);

    new CfnDeployment(this, 'SourceApiDeployment', {
      stageName: 'prod',
      restApiId: sourceRestApi.ref
    }).addDependsOn(mymethod);
  }
}
