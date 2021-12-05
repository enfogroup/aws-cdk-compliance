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
  #encryption: QueueEncryption | undefined
  constructor (scope: Construct, id: string, props?: QueueProps) {
    super(scope, id, {
      ...defaultQueueProps,
      ...props
    })
    const calculatedProps = {
      ...defaultQueueProps,
      ...props
    }
    this.#encryption = calculatedProps.encryption

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  private checkEncryption () {
    return this.#encryption !== undefined && this.#encryption !== QueueEncryption.UNENCRYPTED
      ? []
      : ['encryption must not be undefined nor set to "UNENCRYPTED"']
  }
}
