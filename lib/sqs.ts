import { Queue as SQSQueue, QueueProps as SQSQueueProps, QueueEncryption as SQSQueueEncryption } from '@aws-cdk/aws-sqs'
import { Construct } from '@aws-cdk/core'

/**
 * Properties for a new Compliant SQS Queue
 */
export enum QueueEncryption {
  KMS_MANAGED = SQSQueueEncryption.KMS_MANAGED,
  KMS = SQSQueueEncryption.KMS,
}
export type QueueProps = Omit<SQSQueueProps, 'encryption'> & {
  readonly encryption: QueueEncryption
}

/**
 * Compliant SQS Queue.
 * The QueueProps key 'encryption' is required and will be used to encrypt the Queue
 *
 * See README for usage examples
 */
export class Queue extends SQSQueue {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props: QueueProps) {
    super(scope, id, props as unknown as SQSQueueProps)
  }
}
