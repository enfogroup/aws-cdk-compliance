import { Topic as SNSTopic, TopicProps } from 'aws-cdk-lib/aws-sns'
import { Construct, Node } from 'constructs'

/**
 * Compliant SNS Topic.
 * The TopicProps key 'masterKey' is required and will be used to encrypt the Topic
 *
 * See README for usage examples
 */
export class Topic extends SNSTopic {
  protected calculatedProps: TopicProps
  constructor (scope: Construct, id: string, props: TopicProps) {
    super(scope, id, props)
    this.calculatedProps = props

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkMasterKey()
        ]
      }
    })
  }

  private checkMasterKey (): string[] {
    return !this.calculatedProps.masterKey
      ? ['topic must be encrypted']
      : []
  }
}
