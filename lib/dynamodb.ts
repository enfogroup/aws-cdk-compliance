import { BillingMode, Table, TableProps } from '@aws-cdk/aws-dynamodb'
import { Construct } from '@aws-cdk/core'
import { forceTagDynamoDBAsSafe } from './tags'

export type SaneDefaultsTableProps = TableProps & {
  billingMode: BillingMode.PAY_PER_REQUEST
}

export type EnforcedComplianceTableProps = TableProps & {
  billingMode: BillingMode.PROVISIONED
}

export class SaneDefaultsTable extends Table {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props: SaneDefaultsTableProps) {
    super(scope, id, props)
  }
}

export class EnforcedComplianceTable extends Table {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props: EnforcedComplianceTableProps) {
    super(scope, id, props)
    forceTagDynamoDBAsSafe(this)
  }
}
