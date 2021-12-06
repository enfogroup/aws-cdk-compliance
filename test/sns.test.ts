// to be tested
import { Topic, TopicProps } from '../lib/sns'

// tools
import '@aws-cdk/assert/jest'
import { Key } from '../lib/kms'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

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
