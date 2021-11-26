// to be tested
import { Queue, QueueProps } from '../lib/sqs'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'
import { QueueEncryption } from '@aws-cdk/aws-sqs'

describe('SQS', () => {
  describe('Queue', () => {
    it('should use managed encryption', () => {
      const stack = new Stack()
      const props: QueueProps = {
        encryption: QueueEncryption.KMS_MANAGED
      }

      new Queue(stack, 'Queue', props)

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::SQS::Queue', Match.objectLike({
        KmsMasterKeyId: 'alias/aws/sqs'
      }))
    })
  })
})
