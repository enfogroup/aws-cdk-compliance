import { Topic as SNSTopic, TopicProps as SNSTopicProps } from '@aws-cdk/aws-sns'
import { Construct } from '@aws-cdk/core'
import { PickRequiredKeys } from './models'

/**
 * Properties for a new Compliant SNS Topic
 */
export type TopicProps = PickRequiredKeys<SNSTopicProps, 'masterKey'> & SNSTopicProps

/**
 * Compliant SNS Topic.
 * The TopicProps key 'masterKey' is required and will be used to encrypt the Topic
 *
 * See README for usage examples
 */
export class Topic extends SNSTopic {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props: TopicProps) {
    super(scope, id, props)
  }
}
