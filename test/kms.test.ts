// to be tested
import { Key } from '../lib/kms'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

describe('KMS', () => {
  describe('Key', () => {
    it('should enable rotation', () => {
      const stack = new Stack()

      new Key(stack, 'Key', { })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::KMS::Key', Match.objectLike({
        EnableKeyRotation: true
      }))
    })

    it('should allow enabling of key rotation', () => {
      const stack = new Stack()

      new Key(stack, 'Key', { enableKeyRotation: true })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::KMS::Key', Match.objectLike({
        EnableKeyRotation: true
      }))
    })

    it('should throw if key rotation is set to undefined', () => {
      const stack = new Stack()

      new Key(stack, 'Key', { enableKeyRotation: undefined })

      expect(() => Template.fromStack(stack)).toThrow('enableKeyRotation must be true')
    })

    it('should throw if key rotation is disabled', () => {
      const stack = new Stack()

      new Key(stack, 'Key', { enableKeyRotation: false })

      expect(() => Template.fromStack(stack)).toThrow('enableKeyRotation must be true')
    })
  })
})
