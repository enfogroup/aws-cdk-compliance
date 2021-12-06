import { Queue as SQSQueue, QueueProps, QueueEncryption } from 'aws-cdk-lib/aws-sqs'
import { Construct } from 'constructs'

/**
 * Properties for a new Compliant SQS Queue
 */
export const defaultQueueProps = {
  encryption: QueueEncryption.KMS_MANAGED
}

/**
 * Compliant SQS Queue.
 *
 * See README for usage examples
 */
export class Queue extends SQSQueue {
  protected calculatedProps: QueueProps
  constructor (scope: Construct, id: string, props?: QueueProps) {
    super(scope, id, {
      ...defaultQueueProps,
      ...props
    })
    this.calculatedProps = {
      ...defaultQueueProps,
      ...props
    }

    this.node.addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  protected checkEncryption () {
    return (!this.calculatedProps.encryption || this.calculatedProps.encryption === QueueEncryption.UNENCRYPTED)
      ? ['queue must be encrypted']
      : []
  }
}
