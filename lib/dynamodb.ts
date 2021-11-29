import { BillingMode, Table as DynamoDBTable, TableProps } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'
import { forceTagDynamoDBAsSafe } from './tags'

export class Table extends DynamoDBTable {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props: TableProps) {
    const { billingMode, ...rest } = props
    super(scope, id, rest)

    if (!billingMode || billingMode === BillingMode.PROVISIONED) {
      forceTagDynamoDBAsSafe(this)
    }
  }
}
