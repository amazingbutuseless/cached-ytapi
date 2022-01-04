import type { AWS } from '@serverless/typescript';

import request from '@functions/request';

const serverlessConfiguration: AWS = {
  service: 'cached-ytapi',

  frameworkVersion: '2',

  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin'],

  provider: {
    name: 'aws',
    region: 'ap-northeast-2',

    runtime: 'nodejs14.x',
    memorySize: 512,

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },

    lambdaHashingVersion: '20201221',

    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:GetObject', 's3:PutObject'],
        Resource: ['${env:CACHE_BUCKET_ARN}', '${env:CACHE_BUCKET_ARN}/*'],
      },
    ],

    deploymentBucket: {
      name: 'amazingbutuseless-serverless-deploy',
    },
  },

  functions: {
    request: { ...request, environment: { GOOGLE_SERVICE_ACCOUNT_JWT: '${env:GOOGLE_SERVICE_ACCOUNT_JWT}' } },
  },

  package: { individually: true },

  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
