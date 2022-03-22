// to be tested
import { Table } from '../lib/dynamodb'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from 'aws-cdk-lib'
import { Attribute, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb'
import { ABSENT } from '@aws-cdk/assert/lib/assertions/have-resource'

describe('DynamoDB', () => {
  const partitionKey: Attribute = {
    name: 'pk',
    type: AttributeType.STRING
  }

  describe('Table', () => {
    it('should default to billingMode PAY_PER_REQUEST', () => {
      const stack = new Stack()

      new Table(stack, 'Table', {
        partitionKey
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        ProvisionedThroughput: ABSENT
      })
    })

    it('should not tag the resource if no billing mode is set', () => {
      const stack = new Stack()

      new Table(stack, 'Table', {
        partitionKey
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        Tags: ABSENT
      })
    })

    it('should not tag the resource if billing mode is PAY_PER_REQUEST', () => {
      const stack = new Stack()

      new Table(stack, 'Table', {
        partitionKey,
        billingMode: BillingMode.PAY_PER_REQUEST
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        Tags: ABSENT
      })
    })

    it('should enable point in time recovery by default', () => {
      const stack = new Stack()

      new Table(stack, 'Table', {
        partitionKey
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        PointInTimeRecoverySpecification: {
          PointInTimeRecoveryEnabled: true
        }
      })
    })

    it('should be possible to disable point in time recovery', () => {
      const stack = new Stack()

      new Table(stack, 'Table', {
        partitionKey,
        pointInTimeRecovery: false
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        PointInTimeRecoverySpecification: ABSENT
      })
    })
  })
})
