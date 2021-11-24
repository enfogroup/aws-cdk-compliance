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

As a part of our compliance reports we send out information about resources that are non-compliant. This package exposes compliant Constructs which are extension of AWS Constructs. When possible the Props used to create the Construct are exposed as well.

### KMS

The following features are available for KMS.

* Key, compliant KMS Key Construct
* compliantKeyProps, the KeyProps used to enforce compliance

Key creation example

```typescript
import { Key } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Key(stack, 'Key')
```

While we recommend using our Key Construct you can also create Keys using the Construct from AWS.

```typescript
import { compliantKeyProps } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'
import { Key } from '@aws-cdk/aws-kms'

const stack = new Stack()
new Key(stack, 'Key', { description: 'My fancy key', ...compliantKeyProps })
```

### S3

The following features are available for S3.

* Bucket, compliant S3 Bucket Construct
* compliantBucketProps, the BucketProps used to enforce compliance


Bucket creation example

```typescript
import { Bucket } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Bucket(stack, 'MyBucket')
```

Including more props

```typescript
import { Bucket } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Bucket(stack, 'MyBucket', { bucketName: 'my-bucket' })
```

While we recommend using our Bucket Construct you can also create Buckets using the Construct from AWS.

```typescript
import { compliantBucketProps } from '@enfo/rename-me'
import { Stack } from '@aws-cdk/core'
import { Bucket } from '@aws-cdk/aws-s3'

const stack = new Stack()
new Bucket(stack, 'MyBucket', { bucketName: 'my-bucket', ...compliantBucketProps })
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
const masterKey = new Key(stack, 'Key')
const props: TopicProps = {
  masterKey,
  // other values you want to set
}
new Topic(stack, 'Topic', props)
```
