import { BillingMode, Table as DynamoDBTable, TableProps } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'

import { allowBillingModeProvisioned } from './tags'

/**
 * Compliant DynamoDB Table.
 * If you fail to define billingMode or use BillingMode.PROVISIONED this Table will tag the resource as compliant.
 * We recommend using BillingMode.PAY_PER_REQUEST, but there are definitely use cases for BillingMode.PROVISIONED as well.
 *
 * See README for usage examples
 */
export class Table extends DynamoDBTable {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props: TableProps) {
    const { billingMode, ...rest } = props
    super(scope, id, rest)

    if (!billingMode || billingMode === BillingMode.PROVISIONED) {
      allowBillingModeProvisioned(this)
    }
  }
}
