import { Queue as SQSQueue, QueueProps as SQSQueueProps, QueueEncryption as SQSQueueEncryption } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'
import { PickRequiredKeys } from './models'

export interface QueueProps extends SQSQueueProps {
  readonly encryption?: Exclude<SQSQueueEncryption, SQSQueueEncryption.UNENCRYPTED>
}

type InternalQueueProps = PickRequiredKeys<QueueProps, 'encryption'> & QueueProps

/**
 * Properties for a new Compliant SQS Queue
 */
export const defaultQueueProps = {
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
      ...defaultQueueProps,
      ...props
    } as InternalQueueProps)
  }
}
