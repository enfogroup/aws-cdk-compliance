// to be tested
import { Topic } from '../lib/sns'

// tools
import '@aws-cdk/assert/jest'
import { Key } from '../lib/kms'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

describe('SNS', () => {
  describe('Topic', () => {
    it('should use the KMS Key', () => {
      const stack = new Stack()

      new Topic(stack, 'Topic', {
        masterKey: new Key(stack, 'Key')
      })

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

    it('should throw if masterKey is undefined', () => {
      const stack = new Stack()

      new Topic(stack, 'Topic', {})

      expect(() => Template.fromStack(stack)).toThrow('masterKey must not be undefined')
    })
  })
})
