import { Queue as SQSQueue, QueueProps, QueueEncryption } from 'aws-cdk-lib/aws-sqs'
import { Construct, Node } from 'constructs'

/**
 * Properties for a new Compliant SQS Queue
 */
export const defaultQueueProps = {
  encryption: QueueEncryption.KMS_MANAGED
}

/**
 * Compliant SQS Queue.
 * If a property is poorly set a human readable error will be thrown upon synthesis.
 *
 * See README for usage examples
 */
export class Queue extends SQSQueue {
  myProps: QueueProps
  constructor (scope: Construct, id: string, props?: QueueProps) {
    super(scope, id, {
      ...defaultQueueProps,
      ...props
    })
    this.myProps = {
      ...defaultQueueProps,
      ...props
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  private checkEncryption () {
    return this.myProps.encryption === QueueEncryption.UNENCRYPTED
      ? ['queue must be encrypted']
      : []
  }
}
