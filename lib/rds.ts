import {
  DatabaseInstance as RDSDatabaseInstance,
  DatabaseInstanceProps as RDSDatabaseInstanceProps
} from '@aws-cdk/aws-rds'
import { Construct } from '@aws-cdk/core'

export interface DatabaseInstanceProps extends RDSDatabaseInstanceProps {
  readonly publiclyAccessible?: false
}

interface InternalDatabaseInstanceProps extends DatabaseInstanceProps {
  readonly publiclyAccessible: false
}

/**
 * Properties for a new Compliant RDS Instance
 */
export const defaultDatabaseInstanceProps = {
  publiclyAccessible: false
}

/**
 * Compliant RDS Instance
 *
 * See README for usage examples
 */
export class DatabaseInstance extends RDSDatabaseInstance {
  // eslint-disable-next-line no-useless-constructor
  constructor(scope: Construct, id: string, props?: DatabaseInstanceProps) {
    super(scope, id, {
      ...defaultDatabaseInstanceProps,
      ...props
    } as InternalDatabaseInstanceProps)
  }
}
