// to be tested
import { Topic, TopicProps } from '../lib/sns'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Key } from '../lib/kms'
import { Template, Match } from '@aws-cdk/assertions'

describe('SNS', () => {
  describe('Topic', () => {
    // bit of a mute test, should look into testing using tsd or similar
    it('should use the KMS Key', () => {
      const stack = new Stack()
      const props: TopicProps = {
        masterKey: new Key(stack, 'Key')
      }

      new Topic(stack, 'Topic', props)

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::SNS::Topic', Match.objectLike({
        KmsMasterKeyId: {
          'Fn::GetAtt': [
            Match.anyValue(),
            'Arn'
          ]
        }
      }))
    })
  })
})