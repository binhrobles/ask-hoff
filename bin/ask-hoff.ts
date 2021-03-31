#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import AskHoffStack from '../lib/ask-hoff-stack';

const app = new cdk.App();
new AskHoffStack(app, 'AskHoffStack');
