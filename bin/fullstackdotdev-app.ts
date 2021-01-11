#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaWithNoTriggersStack } from '../lib/1-lambda-with-no-triggers-stack/lambda-with-no-triggers-stack';
import { LambdaWithRestApiTriggerL1ConstructStack } from '../lib/2-lambda-with-rest-api-trigger-level1-construct-stack/lambda-with-rest-api-trigger-level1-construct-stack';

const app = new cdk.App();
new LambdaWithNoTriggersStack(app, 'LambdaWithNoTriggers');
new LambdaWithRestApiTriggerL1ConstructStack(
  app,
  'LambdaWithRestApiTriggerL1Construct'
);
