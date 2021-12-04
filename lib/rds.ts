import {
  DatabaseCluster as RDSDatabaseCluster,
  DatabaseClusterProps as RDSDatabaseClusterProps,
  DatabaseInstance as RDSDatabaseInstance,
  DatabaseInstanceProps as RDSDatabaseInstanceProps,
  InstanceProps as RDSInstanceProps
} from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'

export enum DatabaseEnvironments {
  PROD,
  NONPROD
}

export interface DatabaseInstanceProps extends RDSDatabaseInstanceProps {
  readonly publiclyAccessible?: false
  readonly storageEncrypted?: true
  readonly iamAuthentication?: true
  readonly autoMinorVersionUpgrade?: true
  readonly copyTagsToSnapshot?: true
  readonly deletionProtection?: true
  readonly environment?: DatabaseEnvironments
}

interface InternalDatabaseInstanceProps extends DatabaseInstanceProps {
  readonly publiclyAccessible: false
  readonly storageEncrypted: true
  readonly iamAuthentication: true
  readonly autoMinorVersionUpgrade: true
  readonly copyTagsToSnapshot: true
  readonly deletionProtection: true
  readonly environment: DatabaseEnvironments
}

/**
 * Properties for a new Compliant RDS Instance
 */
export const defaultDatabaseInstanceProps = {
  publiclyAccessible: false,
  storageEncrypted: true,
  iamAuthentication: true,
  autoMinorVersionUpgrade: true,
  copyTagsToSnapshot: true,
  deletionProtection: true,
  multiAz: true,
  environment: DatabaseEnvironments.PROD
}

/**
 * Compliant RDS Instance
 *
 * See README for usage examples
 */
export class DatabaseInstance extends RDSDatabaseInstance {
  protected environment: DatabaseEnvironments
  protected multiAz: boolean
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props?: DatabaseInstanceProps) {
    super(scope, id, {
      ...defaultDatabaseInstanceProps,
      ...props
    } as InternalDatabaseInstanceProps)
    this.environment = props?.environment ?? defaultDatabaseInstanceProps.environment
    this.multiAz = props?.multiAz ?? defaultDatabaseInstanceProps.multiAz
  }

  protected validate () {
    return [
      ...this.checkMultiAz()
    ]
  }

  protected checkMultiAz () {
    return (this.environment === DatabaseEnvironments.PROD && !this.multiAz)
      ? ['Prod instances must be multi AZ']
      : []
  }
}

export interface InstanceProps extends RDSInstanceProps {
  readonly publiclyAccessible?: false
  readonly autoMinorVersionUpgrade?: true
}

export interface DatabaseClusterProps extends RDSDatabaseClusterProps {
  readonly storageEncrypted?: true
  readonly iamAuthentication?: true
  readonly copyTagsToSnapshot?: true
  readonly deletionProtection?: true
  readonly instanceProps: InstanceProps
}

interface InternalInstanceProps extends InstanceProps {
  readonly publiclyAccessible: false
  readonly autoMinorVersionUpgrade: true
}

interface InternalDatabaseClusterProps extends DatabaseClusterProps {
  readonly storageEncrypted: true
  readonly iamAuthentication: true
  readonly copyTagsToSnapshot: true
  readonly deletionProtection: true
  readonly instanceProps: InternalInstanceProps
}

/**
 * Properties for a new Compliant RDS Cluster
 */
export const defaultDatabaseClusterProps = {
  storageEncrypted: true,
  iamAuthentication: true,
  copyTagsToSnapshot: true,
  deletionProtection: true
}
export const defaultInstanceProps = {
  publiclyAccessible: false,
  autoMinorVersionUpgrade: true
}

/**
 * Compliant RDS Cluster
 *
 * See README for usage examples
 */
export class DatabaseCluster extends RDSDatabaseCluster {
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props?: DatabaseClusterProps) {
    super(scope, id, {
      ...defaultDatabaseClusterProps,
      ...props,
      instanceProps: {
        ...defaultInstanceProps,
        ...props?.instanceProps
      }
    } as InternalDatabaseClusterProps)
  }
}
