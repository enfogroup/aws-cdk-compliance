import { BillingMode, Table as DynamoDBTable, TableProps } from 'aws-cdk-lib/aws-dynamodb'
import { Construct } from 'constructs'

import { allowBillingModeProvisioned } from './tags'

/**
 * Compliant DynamoDB Table.
 * Defaults to using BillingMode.PAY_PER_REQUEST
 * If you use BillingMode.PROVISIONED this Table will tag the resource as compliant.
 *
 * See README for usage examples
 */
export class Table extends DynamoDBTable {
  constructor (scope: Construct, id: string, props: TableProps) {
    const { billingMode = BillingMode.PAY_PER_REQUEST, ...rest } = props
    super(scope, id, {
      billingMode,
      ...rest
    })

    if (billingMode === BillingMode.PROVISIONED) {
      allowBillingModeProvisioned(this)
    }
  }
}
