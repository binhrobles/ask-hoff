#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import AskHoffStack from '../lib/ask-hoff-stack';
import PermissionsBoundary from '../lib/msk-iam-aspect';

const app = new cdk.App();
const stack = new AskHoffStack(app, 'AskHoffStack');

cdk.Aspects.of(stack).add(new PermissionsBoundary('arn:aws:iam::573835758984:policy/hccp-sandbox-engineer-user-policy'));

const stackTags = cdk.Tags.of(stack);
stackTags.add('msk:cost-center', 'foo');
stackTags.add('msk:owner', 'roblesb');
stackTags.add('msk:resource-name', 'foo');
