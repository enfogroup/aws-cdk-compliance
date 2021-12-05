import {
  DatabaseCluster as RDSDatabaseCluster,
  DatabaseClusterProps as RDSDatabaseClusterProps,
  DatabaseInstance as RDSDatabaseInstance,
  DatabaseInstanceProps as RDSDatabaseInstanceProps,
  InstanceProps as RDSInstanceProps
} from 'aws-cdk-lib/aws-rds'
import { Construct, Node } from 'constructs'

export enum DatabaseEnvironment {
  PRODUCTION,
  NOT_PRODUCTION
}

export interface DatabaseInstanceProps extends RDSDatabaseInstanceProps {
  readonly environment?: DatabaseEnvironment
}

interface InternalDatabaseInstanceProps extends DatabaseInstanceProps {
  readonly publiclyAccessible: false
  readonly storageEncrypted: true
  readonly iamAuthentication: true
  readonly autoMinorVersionUpgrade: true
  readonly copyTagsToSnapshot: true
  readonly deletionProtection: true
  readonly environment: DatabaseEnvironment
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
  environment: DatabaseEnvironment.PRODUCTION
}

/**
 * Compliant RDS Instance
 *
 * See README for usage examples
 */
export class DatabaseInstance extends RDSDatabaseInstance {
  #props: DatabaseInstanceProps
  protected environment: DatabaseEnvironment
  protected multiAz: boolean
  constructor (scope: Construct, id: string, props: DatabaseInstanceProps) {
    super(scope, id, {
      ...defaultDatabaseInstanceProps,
      ...props
    } as InternalDatabaseInstanceProps)
    this.environment = props?.environment ?? defaultDatabaseInstanceProps.environment
    this.multiAz = props?.multiAz ?? defaultDatabaseInstanceProps.multiAz
    this.#props = {
      ...defaultDatabaseInstanceProps,
      ...props
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkPubliclyAccessible(),
          ...this.checkStorageEncrypted(),
          ...this.checkIAMAuthentication(),
          ...this.checkAutoUpgrade(),
          ...this.checkCopyTags(),
          ...this.checkDeletionProtection(),
          ...this.checkMultiAz()
        ]
      }
    })
  }

  protected checkPubliclyAccessible () {
    const publiclyAccessible = this.#props.publiclyAccessible
    return publiclyAccessible !== undefined && !publiclyAccessible
      ? []
      : ['publiclyAccessible must not be undefined nor true']
  }

  protected checkStorageEncrypted () {
    return this.#props.storageEncrypted
      ? []
      : ['storageEncrypted must not be undefined nor false']
  }

  protected checkIAMAuthentication () {
    return this.#props.iamAuthentication
      ? []
      : ['iamAuthentication must not be undefined nor false']
  }

  protected checkAutoUpgrade () {
    return this.#props.autoMinorVersionUpgrade
      ? []
      : ['autoMinorVersionUpgrade must not be undefined nor false']
  }

  protected checkCopyTags () {
    return this.#props.copyTagsToSnapshot
      ? []
      : ['copyTagsToSnapshot must not be undefined nor false']
  }

  protected checkDeletionProtection () {
    return this.#props.deletionProtection
      ? []
      : ['deletionProtection must not be undefined nor false']
  }

  protected checkMultiAz () {
    return (this.environment === DatabaseEnvironment.PRODUCTION && !this.multiAz)
      ? ['Production instance must be multi AZ']
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
