// to be tested
import { SaneDefaultsTable, EnforcedComplianceTable } from '../lib/dynamodb'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Attribute, AttributeType, BillingMode } from '@aws-cdk/aws-dynamodb'

describe('DynamoDB', () => {
  const partitionKey: Attribute = {
    name: 'pk',
    type: AttributeType.STRING
  }

  describe('SaneDefaultsTable', () => {
    it('should enforce billing mode to PAY_PER_REQUEST', () => {
      const stack = new Stack()

      new SaneDefaultsTable(stack, 'Table', {
        partitionKey,
        billingMode: BillingMode.PAY_PER_REQUEST
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        BillingMode: 'PAY_PER_REQUEST'
      })
    })
  })

  describe('EnforcedComplianceTable', () => {
    it('should enforce billing mode to PROVISIONED', () => {
      const stack = new Stack()

      new EnforcedComplianceTable(stack, 'Table', {
        partitionKey,
        billingMode: BillingMode.PROVISIONED
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      })
    })

    it('should tag the table to disable alarms', () => {
      const stack = new Stack()

      new EnforcedComplianceTable(stack, 'Table', {
        partitionKey,
        billingMode: BillingMode.PROVISIONED
      })

      expect(stack).toHaveResource('AWS::DynamoDB::Table', {
        Tags: [
          {
            Key: 'billingMode',
            Value: 'Provisioned'
          }
        ]
      })
    })
  })
})
