import { Topic as SNSTopic, TopicProps } from 'aws-cdk-lib/aws-sns'
import { Construct } from 'constructs'

/**
 * Compliant SNS Topic.
 *
 * See README for usage examples
 */
export class Topic extends SNSTopic {
  protected calculatedProps: TopicProps
  constructor (scope: Construct, id: string, props: TopicProps) {
    super(scope, id, props)
    this.calculatedProps = props

    this.node.addValidation({
      validate: () => {
        return [
          ...this.checkMasterKey()
        ]
      }
    })
  }

  protected checkMasterKey (): string[] {
    return !this.calculatedProps.masterKey
      ? ['topic must be encrypted']
      : []
  }
}
