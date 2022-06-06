// to be tested
import { NodejsFunction } from '../lib/lambda-nodejs'

// tools
import '@aws-cdk/assert/jest'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { Stack } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'
import * as path from 'path'

describe('Lambda NodeJS', () => {
  describe('NodejsFunction', () => {
    it('should create a lambda', () => {
      const stack = new Stack()

      new NodejsFunction(stack, 'Function', {
        handler: 'handler',
        entry: path.join(__dirname, 'hello-world.ts')
      })

      expect(stack).toHaveResource('AWS::Lambda::Function', {
        Handler: 'index.handler',
        Runtime: 'nodejs16.x'
      })
    })

    it('should throw a relevant error message for bad runtime - NodeJS', () => {
      const stack = new Stack()

      new NodejsFunction(stack, 'Function', {
        runtime: Runtime.NODEJS_14_X,
        handler: 'handler',
        entry: path.join(__dirname, 'hello-world.ts')
      })

      expect(() => { Template.fromStack(stack) }).toThrow('Lambda runtime must be latest runtime available for language. Found nodejs14.x, please use NODEJS_16_X instead')
    })
  })
})
