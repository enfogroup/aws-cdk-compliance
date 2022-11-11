# Introduction

Compliant resource Constructs and tagging using the CDK. The compliant Constructs make it easier to reduce your number of Security Hub security findings. If you are using CloudFormation rather than the CDK you can check the [unit tests](https://github.com/enfogroup/aws-cdk-compliance/tree/master/test) on the source repository to get an idea of what you need to fix.

The tagging part of this package is tied to Enfo and its customers. [Enfo](https://insights.enfo.se/cloud-and-application-development) is a [Managed Service Provider](https://aws.amazon.com/partners/programs/msp/) for AWS. You can of course use the package without being a customer, but the tags might have no effect depending on your AWS organization setup.

## Installation

The package should be installed as a dependency.

```bash
npm install @enfo/aws-cdkompliance --save
```

## Compliant resource Constructs

In Security Hub you can find a list of security findings. We refer to resources with such findings as non-compliant. This package exposes compliant Constructs which are extensions of CDK Constructs. They have been modified to throw errors during CDK synthesis should you try to use a poorly set Construct property. Most Constructs require no input from you and will be compliant by default.

When possible the default Props used to create the Construct are exposed as well.

### Application Load Balancer

The following features are available for Application Load Balancer.

* ApplicationLoadBalancer, compliant Application Load Balancer Construct. Will throw if non-compliant properties are passed
* defaultApplicationLoadBalancerProps, the ApplicationLoadBalancerProps used to make the Application Load Balancer compliant

The following Security Hub findings are managed by the ApplicationLoadBalancer Construct.

* [[ELB.4] Application load balancers should be configured to drop HTTP headers](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-4)
* [[ELB.5] Application and Classic Load Balancers logging should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-5)
* [[ELB.6] Application Load Balancer deletion protection should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-elb-6)

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

The following Security Hub findings are managed by the Distribution Construct.

* [[CloudFront.1] CloudFront distributions should have a default root object configured](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-1)
* [[CloudFront.5] CloudFront distributions should have logging enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-5)
* [[CloudFront.6] CloudFront distributions should have AWS WAF enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-cloudfront-6)

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

The following features are available for DynamoDB.

* Table, Construct defaulting to using BillingMode.PAY_PER_REQUEST and point in time recovery enabled

The following Security Hub findings are managed by the Table Construct.

* [[DynamoDB.1] DynamoDB tables should automatically scale capacity with demand](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-dynamodb-1), softly enforced
* [[DynamoDB.2] DynamoDB tables should have point-in-time recovery enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-dynamodb-2), enabled by default in the Construct. Can be disabled and the findings suppress

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

### EC2

The following features are available for EC2.

* Instance, Construct defaulting to reqiring IMDSv2. Will throw if not required.

The following Security Hub findings are managed by the Instance Construct.

* [[EC2.8] EC2 instances should use IMDSv2](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-ec2-8)
* Will throw if an SSH key is provided, use SSM Session Manager instead
* Will throw if an old instance type is used (e.g. m1), use current instance types

Instance creation example.

```typescript
import { Instance } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'
import { Vpc, InstanceType, MachineImage, AmazonLinuxGeneration, AmazonLinuxCpuType } from 'aws-cdk-lib/aws-ec2'

const stack = new Stack()
const vpc = new Vpc(stack, 'VPC')
new Instance(stack, 'Instance', {
  vpc,
  instanceType: new InstanceType('t4g.medium'),
  machineImage: MachineImage.latestAmazonLinux({
    cpuType: AmazonLinuxCpuType.ARM_64,
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2
  })
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

The following Security Hub findings are managed by the Function Construct.

* [[Lambda.2] Lambda functions should use supported runtimes](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-lambda-2), hard enforced. We limit the supported runtimes to only the latest for each language. Custom runtimes are also fine

Function creation example

```typescript
import { Function } from '@enfo/aws-cdkompliance'
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Function(stack, 'Function', {
  runtime: Runtime.NODEJS_16_X,
  handler: 'handler',
  code: Code.fromInline('myCode')
})
```

### Lambda NodeJS

The following features are available for Lambda NodeJS.

* NodejsFunction, compliant NodeJS Lambda NodejsFunction Construct

The following Security Hub findings are managed by the NodejsFunction Construct.

* [[Lambda.2] Lambda functions should use supported runtimes](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-lambda-2), hard enforced. We limit the supported runtimes to only the latest for each language. Custom runtimes are also fine

NodejsFunction creation example

```typescript
import { NodejsFunction } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new NodejsFunction(stack, 'Function', {
  handler: 'handler',
  entry: path.join(__dirname, '../src/hello-world.ts')
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

The following Security Hub findings are managed by the DatabaseCluster Construct.

* [[RDS.4] RDS cluster snapshots and database snapshots should be encrypted at rest](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-4)
* [[RDS.7] RDS clusters should have deletion protection enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-7)
* [[RDS.12] IAM authentication should be configured for RDS clusters](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-12)
* [[RDS.13] RDS automatic minor version upgrades should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-13)
* [[RDS.16] RDS DB clusters should be configured to copy tags to snapshots](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-16)

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

The following Security Hub findings are managed by the DatabaseInstance Construct.

* [[RDS.2] RDS DB instances should prohibit public access, determined by the PubliclyAccessible configuration](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-2)
* [[RDS.3] RDS DB instances should have encryption at rest enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-3)
* [[RDS.4] RDS cluster snapshots and database snapshots should be encrypted at rest](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-4)
* [[RDS.5] RDS DB instances should be configured with multiple Availability Zones](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-5)
* [[RDS.8] RDS DB instances should have deletion protection enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-8)
* [[RDS.10] IAM authentication should be configured for RDS instances](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-10)
* [[RDS.13] RDS automatic minor version upgrades should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-13)
* [[RDS.17] RDS DB instances should be configured to copy tags to snapshots](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-rds-17)

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

The following Security Hub findings are managed by the Bucket Construct.

* [[S3.1] S3 Block Public Access setting should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-1)
* [[S3.2] S3 buckets should prohibit public read access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-2)
* [[S3.3] S3 buckets should prohibit public write access](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-3)
* [[S3.4] S3 buckets should have server-side encryption enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-4)
* [[S3.5] S3 buckets should require requests to use Secure Socket Layer](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-5)
* [[S3.8] S3 Block Public Access setting should be enabled at the bucket level](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-8)


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

The following Security Hub findings are managed by the Topic Construct.

* [[SNS.1] SNS topics should be encrypted at rest using AWS KMS](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-sns-1)

Topic creation example

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

The following Security Hub findings are managed by the Queue Construct.

* [[SQS.1] Amazon SQS queues should be encrypted at rest](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-sqs-1)

Queue creation example.

```typescript
import { Queue } from '@enfo/aws-cdkompliance'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
new Queue(stack, 'Queue', { queueName: 'my-queue' })
```

## Tagging

This section largely caters to Enfo customers. If you are not an Enfo customer you can still achieve the functionality described for enableBackups.

### enableBackups

If you are an Enfo customer you can enable backups of databases using tags. This can easily be achieved by using the function **enableBackups**. This function can be applied on a Resource, Stack or App level.

If you are not an Enfo customer can achieve backups by reading this [AWS guide](https://docs.aws.amazon.com/aws-backup/latest/devguide/assigning-resources.html).

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
import { App } from 'aws-cdk-lib'

const app = new App()
enableBackups(app)
```

Where backups are stored can be controlled via the second parameter, backupPlan. It defaults to **STANDARD** which creates backups in the region in which the resource exists.

```typescript
import { enableBackups, BackupPlan } from '@enfo/aws-cdkompliance'
import { App } from 'aws-cdk-lib'

const app = new App()
enableBackups(app, BackupPlan.STOCKHOLM)
```

### exemptBucketFromBlockPublicAutoFix

Buckets in an AWS account managed by Enfo will automatically have [[S3.1] S3 Block Public Access setting should be enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-1) fixed. If you do no want this to happen you can use this tagging function to exempt the bucket.

```typescript
import { exemptBucketFromBlockPublicAutoFix } from '@enfo/aws-cdkompliance'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
const bucket = new Bucket(stack)
exemptBucketFromBlockPublicAutoFix(bucket)
```

### exemptBucketFromSslAutoFix

Buckets in an AWS account managed by Enfo will automatically have [[S3.4] S3 buckets should have server-side encryption enabled](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html#fsbp-s3-4) fixed. If you do no want this to happen you can use this tagging function to exempt the bucket.

```typescript
import { exemptBucketFromSslAutoFix } from '@enfo/aws-cdkompliance'
import { Bucket } from 'aws-cdk-lib/aws-s3'
import { Stack } from 'aws-cdk-lib'

const stack = new Stack()
const bucket = new Bucket(stack)
exemptBucketFromSslAutoFix(bucket)
```
