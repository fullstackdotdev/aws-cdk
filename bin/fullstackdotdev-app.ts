#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NoSourceLambdaStack } from '../lib/nosource-lambda-stack';


const app = new cdk.App();
new NoSourceLambdaStack(app, 'NoSourceLambda');
