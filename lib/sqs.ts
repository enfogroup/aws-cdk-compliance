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

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  private checkEncryption () {
    return (!this.calculatedProps.encryption || this.calculatedProps.encryption === QueueEncryption.UNENCRYPTED)
      ? ['queue must be encrypted']
      : []
  }
}
