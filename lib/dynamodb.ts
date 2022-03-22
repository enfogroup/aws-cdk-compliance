import { BillingMode, Table as DynamoDBTable, TableProps } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

/**
 * Compliant DynamoDB Table.
 *
 * See README for usage examples
 */
export class Table extends DynamoDBTable {
  constructor (scope: Construct, id: string, props: TableProps) {
    const { billingMode = BillingMode.PAY_PER_REQUEST, pointInTimeRecovery = true, ...rest } = props
    super(scope, id, {
      billingMode,
      pointInTimeRecovery,
      ...rest
    })
  }
}
