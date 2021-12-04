// to be tested
import { Key } from '../lib/kms'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from 'aws-cdk-lib'

describe('KMS', () => {
  describe('Key', () => {
    it('should enable rotation', () => {
      const stack = new Stack()

      new Key(stack, 'Key', { })

      expect(stack).toHaveResource('AWS::KMS::Key', {
        EnableKeyRotation: true
      })
    })
  })
})
