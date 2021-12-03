# Introduction

Tagging and resource standards using the CDK.

This package is tied to Enfo and its customers. Enfo is a [Managed Service Provider](https://aws.amazon.com/partners/programs/msp/) for AWS. You can of course use the package without being a customer, but the tags might have no effect depending on your AWS organization setup.

## Installation

The package should be installed a dependency.

```bash
npm install @enfo/rename-me --save
```

## Tagging

If you are an Enfo customer you can enable backups of databases using tags. This can easily be achieved by using the function **enableBackups**. This function can be applied on a Resource, Stack or App level.

Enabling backups of a single resource.

```typescript
import { enableBackups } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'
import { Table } from '@aws-cdk/aws-dynamodb'

const stack = new Stack()
const myTable = new Table(stack, ...)
enableBackups(myTable)
```

Enable backups of an entire stack.

```typescript
import { enableBackups } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
enableBackups(stack)
```

Enable backups of an entire app.

```typescript
import { enableBackups } from '@enfo/rename-me'
import { App } from '@aws-cdk/core'

const app = new App()
enableBackups(app)
```

Where backups are stored can be controlled via the second parameter, backupPlan. It defaults to **STANDARD** which FIXME
FIXME
FIXME
FIXME

```typescript
import { enableBackups, BackupPlan } from '@enfo/rename-me'
import { App } from '@aws-cdk/core'

const app = new App()
enableBackups(app, BackupPlan.STOCKHOLM)
```

## Resource specific settings

As a part of our compliance reports we send out information about resources that are non-compliant. This package exposes compliant Constructs which are extension of AWS Constructs.

When possible the default Props used to create the Construct are exposed as well.

### Application Load Balancer

The following features are available for Application Load Balancer.

* ApplicationLoadBalancer, compliant Applicatoin Load Balancer Construct
* defaultApplicationLoadBalancerProps, the ApplicationLoadBalancerProps used to make the Application Load Balancer compliant

Note that access logs need to be added to the construct.

Note that this construct enables the Drop invalid HTTP headers feature.

Application Load Balancer creation example.

```typescript
import { ApplicationLoadBalancer } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
const vpc = new Vpc(stack, 'VPC')
const bucket = new Bucket(stack, 'Bucket')
const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc })
alb.logAccessLogs(bucket)
```

### CloudFront

The following features are available for CloudFront.

* Distribution, compliant CloudFront Distribution Construct
* defaultDistributionProps, the DistributionProps used to make the distribution compliant

CloudFront Distribution creation example.

```typescript
import { CloudFront } from '@enfo/rename-me'
import { ViewerProtocolPolicy } from '@aws-cdk/aws-cloudfront'
import { HttpOrigin } from '@aws-cdk/aws-cloudfront-origins'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: new HttpOrigin('example.com'),
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
  },
  webAclId: 'some-id',
})
```

### DynamoDB

For DynamoDB we do not have strict compliance requirements. We do however strongly recommend using billing mode PAY_PER_REQUEST. If a Table is created with billing mode PROVISIONED an alarm will be triggered. This can be bypassed by tagging the resource. We expose a Construct which defaults to using PAY_PER_REQUEST. If you use PROVISIONED it will suppress warnings. Please make sure that you are aware of the cost impact of using PROVISIONED. The following features are available for DynamoDB.

* Table, Construct defaulting to using BillingMode.PAY_PER_REQUEST. Will suppress warnings if you use PROVISIONED
* allowBillingModeProvisioned, function for tagging DynamoDB to suppress warnings on PROVISIONED

Table creation example without billingMode specified. Will default to PAY_PER_REQUEST. The Table will not be tagged to suppress warnings. The same will happen if billingMode is set to PAY_PER_REQUEST.

```typescript
import { Table } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'
import { AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb'

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
import { Table } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'
import { AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb'

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

* Key, compliant KMS Key Construct
* KeyProps, modified version of KeyProps which enforces compliance
* defaultKeyProps, the KeyProps used to enforce compliance if you don't supply your own

While we do not enforce *alias* on KeyProps we do recommend that you set it.

Key creation example

```typescript
import { Key } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Key(stack, 'Key', { alias: 'my-key' })
```

### Lambda

The following features are available for Lambda.

* Function, compliant Lambda Function Construct

The Function Construct blocks use of runtimes which is not the latest for a given language. If you try to instantiate a Function using an old runtime it will throw. Custom runtimes are not affected.

Function creation example

```typescript
import { Function } from '@enfo/rename-me'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Function(stack, 'Function', {
  runtime: Runtime.NODEJS_14_X,
  handler: 'handler',
  code: Code.fromInline('myCode')
})
```

Trying to create a Function with a runtime which is not the latest

```typescript
import { Function } from '@enfo/rename-me'
import { Code, Runtime } from '@aws-cdk/aws-lambda'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Function(stack, 'Function', {
  runtime: Runtime.NODEJS_12_X,
  handler: 'handler',
  code: Code.fromInline('myCode')
})

// throws "Lambda runtime must be latest runtime available for language. Found nodejs12.x, please use NODEJS_14_X instead"
```

### S3

The following features are available for S3.

* Bucket, compliant S3 Bucket Construct
* BucketProps, modified version of BucketProps which enforces compliance
* defaultBucketProps, the BucketProps used to enforce compliance if you don't supply your own


Bucket creation example

```typescript
import { Bucket } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Bucket(stack, 'MyBucket', { bucketName: 'my-bucket' })
```

### SNS

The following features are available for SNS. SNS requires a KMS Key Construct to be compliant.

* Topic, compliant SNS Topic Construct
* TopicProps, modified version of TopicProps with the required keys for making the Topic compliant set to required

Topic creation example. Please note that it uses our KMS Key Construct to ensure the Key is compliant as well.

```typescript
import { Key, Topic, TopicProps } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
const props: TopicProps = {
  masterKey: new Key(stack, 'Key'),
  // other values you want to set
}
new Topic(stack, 'Topic', props)
```

### SQS

The following features are available for SQS.

* Queue, compliant SQS Queue Construct
* QueueProps, modified version of QueueProps with the required keys for making the Queue compliant set to required, and only compliant values allowed
* defaultQueueProps, the QueueProps used to make the queue compliant

Queue creation example.

```typescript
import { Queue } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Queue(stack, 'Queue', { fifo: false })
```
