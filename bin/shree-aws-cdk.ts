#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LambdaWithNoTriggersStack } from '../lib/1-lambda-with-no-triggers-stack/lambda-with-no-triggers-stack';
import { LambdaWithRestApiTriggerL1ConstructStack } from '../lib/2-L1-L2-Patterns-Constructs/lambda-with-rest-api-trigger-level1-construct-stack';
import { LambdaWithRestApiTriggerL2ConstructStack } from '../lib/2-L1-L2-Patterns-Constructs/lambda-with-rest-api-trigger-level2-construct-stack';
import { LambdaWithRestApiTriggerPatternConstructStack } from '../lib/2-L1-L2-Patterns-Constructs/lambda-with-rest-api-trigger-patterns-construct-stack';
import { DynamoDBWithStreamStack } from '../lib/3-dynamodb-with-stream/dynamodb-with-stream';

const app = new cdk.App();
new LambdaWithNoTriggersStack(app, 'LambdaWithNoTriggers');
new LambdaWithRestApiTriggerL1ConstructStack(
  app,
  'LambdaWithRestApiTriggerL1Construct'
);
new LambdaWithRestApiTriggerL2ConstructStack(
  app,
  'LambdaWithRestApiTriggerL2Construct'
);
new LambdaWithRestApiTriggerPatternConstructStack(
  app,
  'LambdaWithRestApiTriggerPatternConstruct'
);

new DynamoDBWithStreamStack(app, 'DynamoDBWithStreamStack');
