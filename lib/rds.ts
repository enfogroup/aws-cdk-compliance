import {
  DatabaseCluster as RDSDatabaseCluster,
  DatabaseClusterProps,
  DatabaseInstance as RDSDatabaseInstance,
  DatabaseInstanceProps as RDSDatabaseInstanceProps
} from 'aws-cdk-lib/aws-rds'
import { Construct, Node } from 'constructs'

export enum DatabaseEnvironment {
  PRODUCTION,
  NOT_PRODUCTION
}

export interface DatabaseInstanceProps extends RDSDatabaseInstanceProps {
  readonly environment?: DatabaseEnvironment
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
  constructor (scope: Construct, id: string, props: DatabaseInstanceProps) {
    super(scope, id, {
      ...defaultDatabaseInstanceProps,
      ...props
    })
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
    return !this.#props.publiclyAccessible
      ? []
      : ['publiclyAccessible must be false']
  }

  protected checkStorageEncrypted () {
    return this.#props.storageEncrypted
      ? []
      : ['storageEncrypted must be true']
  }

  protected checkIAMAuthentication () {
    return this.#props.iamAuthentication
      ? []
      : ['iamAuthentication must be true']
  }

  protected checkAutoUpgrade () {
    return this.#props.autoMinorVersionUpgrade
      ? []
      : ['autoMinorVersionUpgrade must be true']
  }

  protected checkCopyTags () {
    return this.#props.copyTagsToSnapshot
      ? []
      : ['copyTagsToSnapshot must be true']
  }

  protected checkDeletionProtection () {
    return this.#props.deletionProtection
      ? []
      : ['deletionProtection must be true']
  }

  protected checkMultiAz () {
    return (this.#props.environment === DatabaseEnvironment.PRODUCTION && !this.#props.multiAz)
      ? ['Production instance must be multi AZ']
      : []
  }
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
  #props: DatabaseClusterProps
  constructor (scope: Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id, {
      ...defaultDatabaseClusterProps,
      ...props,
      instanceProps: {
        ...defaultInstanceProps,
        ...props.instanceProps
      }
    })
    this.#props = {
      ...defaultDatabaseClusterProps,
      ...props,
      instanceProps: {
        ...defaultInstanceProps,
        ...props?.instanceProps
      }
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkPubliclyAccessible(),
          ...this.checkStorageEncrypted(),
          ...this.checkIAMAuthentication(),
          ...this.checkAutoUpgrade(),
          ...this.checkCopyTags(),
          ...this.checkDeletionProtection()
        ]
      }
    })
  }

  protected checkStorageEncrypted () {
    return this.#props.storageEncrypted
      ? []
      : ['storageEncrypted must be true']
  }

  protected checkIAMAuthentication () {
    return this.#props.iamAuthentication
      ? []
      : ['iamAuthentication must be true']
  }

  protected checkCopyTags () {
    return this.#props.copyTagsToSnapshot
      ? []
      : ['copyTagsToSnapshot must be true']
  }

  protected checkDeletionProtection () {
    return this.#props.deletionProtection
      ? []
      : ['deletionProtection must be true']
  }

  protected checkPubliclyAccessible () {
    return !this.#props.instanceProps.publiclyAccessible
      ? []
      : ['publiclyAccessible must be false']
  }

  protected checkAutoUpgrade () {
    return this.#props.instanceProps.autoMinorVersionUpgrade
      ? []
      : ['autoMinorVersionUpgrade must be true']
  }
}
