// to be tested
import { Function, validRuntimes } from '../lib/lambda'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Runtime, Code } from '@aws-cdk/aws-lambda'
import { Bucket } from '../lib'

describe('Lambda', () => {
  describe('Function', () => {
    it('should create a lambda', () => {
      const stack = new Stack()

      new Function(stack, 'Function', {
        runtime: Runtime.NODEJS_14_X,
        handler: 'something.js',
        code: Code.fromInline('magicCode')
      })

      expect(stack).toHaveResource('AWS::Lambda::Function', {
        Code: {
          ZipFile: 'magicCode'
        },
        Handler: 'something.js',
        Runtime: 'nodejs14.x'
      })
    })

    it('should accept all valid non-custom runtimes', () => {
      validRuntimes.forEach((runtime: Runtime): void => {
        const stack = new Stack()

        new Function(stack, 'Function', {
          runtime,
          handler: 'something.js',
          code: Code.fromBucket(new Bucket(stack, 'Bucket'), 'file.zip') // some runtimes won't accept inline code
        })
      })
    })

    it('should throw a relevant error message for bad runtime - NodeJS', () => {
      const stack = new Stack()

      expect(() => {
        new Function(stack, 'Function', {
          runtime: Runtime.NODEJS_12_X,
          handler: 'something.js',
          code: Code.fromInline('magicCode')
        })
      }).toThrow('Lambda runtime must be latest runtime available for language. Found nodejs12.x, please use NODEJS_14_X instead')
    })

    it('should throw a relevant error message for bad runtime - Java', () => {
      const stack = new Stack()

      expect(() => {
        new Function(stack, 'Function', {
          runtime: Runtime.JAVA_8,
          handler: 'something.js',
          code: Code.fromInline('magicCode')
        })
      }).toThrow('Lambda runtime must be latest runtime available for language. Found java8, please use JAVA_11 instead')
    })

    it('should throw a relevant error message for bad runtime - Python', () => {
      const stack = new Stack()

      expect(() => {
        new Function(stack, 'Function', {
          runtime: Runtime.PYTHON_2_7,
          handler: 'something.js',
          code: Code.fromInline('magicCode')
        })
      }).toThrow('Lambda runtime must be latest runtime available for language. Found python2.7, please use PYTHON_3_9 instead')
    })
  })
})
