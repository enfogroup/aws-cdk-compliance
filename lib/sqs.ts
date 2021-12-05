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
    this.#encryption = props?.encryption

    Node.of(this).addValidation({
      validate: this.validate
    })
  }

  private validate () {
    return [
      ...this.checkEncryption()
    ]
  }

  private checkEncryption () {
    return this.#encryption !== QueueEncryption.UNENCRYPTED
      ? []
      : ['SQS Queue must be encrypted. QueueEncryption.UNENCRYPTED is not allow.']
  }
}
