// to be tested
import { LogGroup } from '../lib/logs'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

describe('Logs', () => {
  describe('LogGroup', () => {
    it('should have sane defaults', () => {
      const stack = new Stack()

      new LogGroup(stack, 'LG')

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::Logs::LogGroup', Match.objectLike({
        RetentionInDays: 30
      }))
    })

    it('should throw if no retention period', () => {
      const stack = new Stack()

      new LogGroup(stack, 'LG', { retention: undefined })

      expect(() => Template.fromStack(stack)).toThrow('retention must be set')
    })
  })
})
