# Introduction

Tagging and compliant resource using the CDK. This package is yet to hit version 1.x, you might encounter issues.

This package is tied to Enfo and its customers. Enfo is a [Managed Service Provider](https://aws.amazon.com/partners/programs/msp/) for AWS. You can of course use the package without being a customer, but the tags might have no effect depending on your AWS organization setup.

## Installation

The package should be installed as a dependency.

```bash
npm install @enfo/aws-cdkompliance --save
```

## Tagging

If you are an Enfo customer you can enable backups of databases using tags. This can easily be achieved by using the function **enableBackups**. This function can be applied on a Resource, Stack or App level.

Enabling backups of a single resource.

```typescript
import { enableBackups, Table } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb'

const stack = new Stack()
const myTable = new Table(stack, 'Table', { 
  partitionKey: {
    name: 'pk',
    type: AttributeType.STRING
  }
})
enableBackups(myTable)
```

Enable backups of an entire stack.

```typescript
import { enableBackups } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
enableBackups(stack)
```

Enable backups of an entire app.

```typescript
import { enableBackups } from '@enfo/aws-cdkompliance'
import { App } from '@aws-cdk/core'

const app = new App()
enableBackups(app)
```

Where backups are stored can be controlled via the second parameter, backupPlan. It defaults to **STANDARD** which creates backups in the region in which the resource exists.

```typescript
import { enableBackups, BackupPlan } from '@enfo/aws-cdkompliance'
import { App } from '@aws-cdk/core'

const app = new App()
enableBackups(app, BackupPlan.STOCKHOLM)
```

## Resource specific settings

As a part of our compliance reports we send out information about resources that are non-compliant. This package exposes compliant Constructs which are extension of AWS Constructs. Failure in compliance will result in errors during synthesis.

When possible the default Props used to create the Construct are exposed as well.

### Application Load Balancer

The following features are available for Application Load Balancer.

* ApplicationLoadBalancer, compliant Application Load Balancer Construct. Will throw if non-compliant properties are passed
* defaultApplicationLoadBalancerProps, the ApplicationLoadBalancerProps used to make the Application Load Balancer compliant

Note that access logs need to be added to the construct.

Note that this construct enables the Drop invalid HTTP headers feature.

Application Load Balancer creation example.

```typescript
import { ApplicationLoadBalancer, Bucket } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'

const stack = new Stack(undefined, 'Stack', { env: { region: 'eu-west-1' } } )
const vpc = new Vpc(stack, 'VPC')
const bucket = new Bucket(stack, 'Bucket')
const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc })
alb.logAccessLogs(bucket)
```

### CloudFront

The following features are available for CloudFront.

* Distribution, compliant CloudFront Distribution Construct. Will throw if non-compliant properties are passed
* defaultDistributionProps, the DistributionProps used to make the distribution compliant

CloudFront Distribution creation example.

```typescript
import { Distribution } from '@enfo/aws-cdkompliance'
import { ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { CfnWebACL } from 'aws-cdk-lib/aws-wafv2'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
const webAcl = new CfnWebACL(stack, 'WebACL', {
  scope: 'CLOUDFRONT',
  defaultAction: { allow: {} },
  visibilityConfig: {
    cloudWatchMetricsEnabled: false,
    metricName: 'metricName',
    sampledRequestsEnabled: false,
  }
})

new Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new HttpOrigin('example.com'),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
  },
  webAclId: webAcl.attrId
})
```

### DynamoDB

For DynamoDB we do not have strict compliance requirements. We do however strongly recommend using billing mode PAY_PER_REQUEST. If a Table is created with billing mode PROVISIONED an alarm will be triggered. This can be bypassed by tagging the resource. We expose a Construct which defaults to using PAY_PER_REQUEST. If you use PROVISIONED it will suppress warnings. Please make sure that you are aware of the cost impact of using PROVISIONED. The following features are available for DynamoDB.

* Table, Construct defaulting to using BillingMode.PAY_PER_REQUEST. Will suppress warnings if you use PROVISIONED
* allowBillingModeProvisioned, function for tagging DynamoDB to suppress warnings on PROVISIONED

Table creation example without billingMode specified. Will default to PAY_PER_REQUEST. The Table will not be tagged to suppress warnings. The same will happen if billingMode is set to PAY_PER_REQUEST.

```typescript
import { Table } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'

const stack = new Stack()
new Table(stack, 'Table', {
  partitionKey: {
    name: 'pk',
    type: AttributeType.STRING
  }
})
```

Table creation example using PROVISIONED. The Table will be tagged to suppress warnings.

```typescript
import { Table } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'

const stack = new Stack()
new Table(stack, 'Table', {
  partitionKey: {
    name: 'pk',
    type: AttributeType.STRING
  },
  billingMode: BillingMode.PROVISIONED
})
```

### KMS

The following features are available for KMS.

* Key, compliant KMS Key Construct. Will throw if non-compliant properties are passed
* defaultKeyProps, the KeyProps used to enforce compliance if you don't supply your own

While we do not enforce *alias* on KeyProps we do recommend that you set it.

Key creation example

```typescript
import { Key } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Key(stack, 'Key', { alias: 'my-key' })
```

### Lambda

The following features are available for Lambda.

* Function, compliant Lambda Function Construct

The Function Construct blocks use of runtimes which is not the latest for a given language. If you try to instantiate a Function using an old runtime it will throw. Custom runtimes are not affected.

Function creation example

```typescript
import { Function } from '@enfo/aws-cdkompliance'
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Function(stack, 'Function', {
  runtime: Runtime.NODEJS_14_X,
  handler: 'handler',
  code: Code.fromInline('myCode')
})
```

### Logs

The following features are available for Logs.

* LogGroup, compliant Log Group Key Construct. Will throw if non-compliant properties are passed
* defaultLogGroupProps, the LogGroupProps used to enforce compliance if you don't supply your own

LogGroup creation example

```typescript
import { LogGroup } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new LogGroup(stack, 'LogGroup')
```

### RDS

The following features are available for RDS

* DatabaseCluster, compliant DatabaseCluster Construct
* defaultDatabaseClusterProps, the DatabaseClusterProps used to make the DatabaseCluster compliant
* defaultInstanceProps, the InstanceProps used to make the DatabaseCluster compliant
* DatabaseEnvironment, to indicate the how a DatabaseInstance will be used
* DatabaseInstance, compliant DatabaseInstance Construct
* defaultDatabaseInstanceProps, the DatabaseInstanceProps used to make the DatabaseInstance compliant

DatabaseCluster creation example.

```typescript
import { DatabaseCluster } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { AuroraPostgresEngineVersion, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds'

const stack = new Stack()
const vpc = new Vpc(stack, 'VPC')
new DatabaseCluster(stack, 'DatabaseCluster', {
  engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_13_4 }),
  instanceProps: {
    vpc
  }
})
```

Note that DatabaseInstance defaults to MultiAZ, and you need to set `environment: NOT_PRODUCTION` to be able to set MultiAZ to false.

DatabaseInstance creation example.

```typescript
import { DatabaseEnvironment, DatabaseInstance } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds'

const stack = new Stack()
const vpc = new Vpc(stack, 'VPC')
new DatabaseInstance(stack, 'Database', {
  vpc,
  engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }),
  environment: DatabaseEnvironment.NOT_PRODUCTION,
  multiAz: false
})
```

### S3

The following features are available for S3.

* Bucket, compliant S3 Bucket Construct
* defaultBucketProps, the BucketProps used to enforce compliance if you don't supply your own


Bucket creation example

```typescript
import { Bucket } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Bucket(stack, 'MyBucket', { bucketName: 'my-bucket' })
```

### SNS

The following features are available for SNS. SNS requires a KMS Key Construct to be compliant.

* Topic, compliant SNS Topic Construct. Will throw if non-compliant properties are passed

Topic creation example. Please note that it uses our KMS Key Construct to ensure the Key is compliant as well.

```typescript
import { Key, Topic } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Topic(stack, 'Topic', {
  masterKey: new Key(stack, 'Key')
})
```

### SQS

The following features are available for SQS.

* Queue, compliant SQS Queue Construct. Will throw if non-compliant properties are passed
* defaultQueueProps, the QueueProps used to make the queue compliant

Queue creation example.

```typescript
import { Queue } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Queue(stack, 'Queue', { queueName: 'my-queue' })
```
