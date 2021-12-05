import { Topic as SNSTopic, TopicProps } from 'aws-cdk-lib/aws-sns'
import { Construct, Node } from 'constructs'

/**
 * Compliant SNS Topic.
 * The TopicProps key 'masterKey' is required and will be used to encrypt the Topic
 *
 * See README for usage examples
 */
export class Topic extends SNSTopic {
  #props: TopicProps
  constructor (scope: Construct, id: string, props: TopicProps) {
    super(scope, id, props)

    this.#props = props
    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkMasterKey()
        ]
      }
    })
  }

  private checkMasterKey (): string[] {
    const masterKey = this.#props.masterKey
    return masterKey !== undefined
      ? []
      : ['masterKey must not be undefined']
  }
}
