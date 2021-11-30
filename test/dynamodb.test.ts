// to be tested
import { Table } from '../lib/dynamodb'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Attribute, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb'
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

    it('should tag the resource if billing mode is PROVISIONED', () => {
      const stack = new Stack()

      new Table(stack, 'Table', {
        partitionKey,
        billingMode: BillingMode.PROVISIONED
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        Tags: [
          {
            Key: 'BillingMode',
            Value: 'Provisioned'
          }
        ]
      })
    })
  })
})
