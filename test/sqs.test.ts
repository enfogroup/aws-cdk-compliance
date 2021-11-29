// to be tested
import { Queue } from '../lib/sqs'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'

describe('SQS', () => {
  describe('Queue', () => {
    it('should default to managed encryption', () => {
      const stack = new Stack()

      new Queue(stack, 'Queue')

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::SQS::Queue', Match.objectLike({
        KmsMasterKeyId: 'alias/aws/sqs'
      }))
    })

    it('works with valid QueueProps', () => {
      const stack = new Stack()

      new Queue(stack, 'Queue', { fifo: false })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::SQS::Queue', Match.objectLike({
        KmsMasterKeyId: 'alias/aws/sqs'
      }))
    })
  })
})
