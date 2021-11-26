import { Queue as SQSQueue, QueueProps as SQSQueueProps, QueueEncryption as SQSQueueEncryption } from '@aws-cdk/aws-sqs'
import { Construct } from '@aws-cdk/core'

export interface QueueProps extends SQSQueueProps {
  readonly encryption: Exclude<SQSQueueEncryption, SQSQueueEncryption.UNENCRYPTED>
}

/**
 * Properties for a new Compliant SQS Queue
 */
export const compliantQueueProps: QueueProps = {
  encryption: SQSQueueEncryption.KMS_MANAGED
}

/**
 * Compliant SQS Queue.
 * The QueueProps key 'encryption' is required and will be used to encrypt the Queue
 *
 * See README for usage examples
 */
export class Queue extends SQSQueue {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props?: QueueProps) {
    super(scope, id, {
      ...compliantQueueProps,
      ...props
    })
  }
}
