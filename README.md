# Introduction

This package is tied to Enfo and its customers. Enfo is a [Manager Service Provider](https://aws.amazon.com/partners/programs/msp/) for AWS. The package defines settings for our tagging and resource standards.

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

As a part of our compliance reports we send out information about resources that are non-compliant. As a part of this package we expose resource defaults that can be spread into the constructor props parameter.

### S3

For S3 we recommend the following settings

* Enforce SSL for all communication with the bucket
* Block public access. Use CloudFront and an [Origin Access Identity](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html) if you are building a site
* Encryption of any sort

Example of full use of the default settings

```typescript
import { S3Defaults } from '@enfo/rename-me'
import { Bucket } from '@aws-cdk/aws-s3'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Bucket(stack, 'MyBucket', S3Defaults)
```

Using defaults but overwriting specific parts. Spread S3Defaults before the settings you want to overwrite.
```typescript
import { S3Defaults } from '@enfo/rename-me'
import { Bucket } from '@aws-cdk/aws-s3'
import { Stack } from '@aws-cdk/core'

const stack = new Stack()
new Bucket(stack, 'MyBucket', {
  ...S3Defaults,
  encryption: BucketEncryption.KMS,
  /* More settings */
})
```
