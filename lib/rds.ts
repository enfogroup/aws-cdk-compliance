import {
  DatabaseCluster as RDSDatabaseCluster,
  DatabaseClusterProps,
  DatabaseInstance as RDSDatabaseInstance,
  DatabaseInstanceProps as RDSDatabaseInstanceProps
} from 'aws-cdk-lib/aws-rds'
import { Construct } from 'constructs'

/**
 * Used to state whether or not this database should be considered a production database or not
 */
export enum DatabaseEnvironment {
  /**
   * When used the database must be deployed to multiple Availability Zones
   */
  PRODUCTION,
  /**
   * When used the database can be deployed to a single Availability Zone
   */
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
  protected calculatedProps: DatabaseInstanceProps
  constructor (scope: Construct, id: string, props: DatabaseInstanceProps) {
    super(scope, id, {
      ...defaultDatabaseInstanceProps,
      ...props
    })
    this.calculatedProps = {
      ...defaultDatabaseInstanceProps,
      ...props
    }

    this.node.addValidation({
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
    return !this.calculatedProps.publiclyAccessible
      ? []
      : ['publiclyAccessible must be false']
  }

  protected checkStorageEncrypted () {
    return this.calculatedProps.storageEncrypted
      ? []
      : ['storageEncrypted must be true']
  }

  protected checkIAMAuthentication () {
    return this.calculatedProps.iamAuthentication
      ? []
      : ['iamAuthentication must be true']
  }

  protected checkAutoUpgrade () {
    return this.calculatedProps.autoMinorVersionUpgrade
      ? []
      : ['autoMinorVersionUpgrade must be true']
  }

  protected checkCopyTags () {
    return this.calculatedProps.copyTagsToSnapshot
      ? []
      : ['copyTagsToSnapshot must be true']
  }

  protected checkDeletionProtection () {
    return this.calculatedProps.deletionProtection
      ? []
      : ['deletionProtection must be true']
  }

  protected checkMultiAz () {
    return (this.calculatedProps.environment === DatabaseEnvironment.PRODUCTION && !this.calculatedProps.multiAz)
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
  protected calculatedProps: DatabaseClusterProps
  constructor (scope: Construct, id: string, props: DatabaseClusterProps) {
    super(scope, id, {
      ...defaultDatabaseClusterProps,
      ...props,
      instanceProps: {
        ...defaultInstanceProps,
        ...props.instanceProps
      }
    })
    this.calculatedProps = {
      ...defaultDatabaseClusterProps,
      ...props,
      instanceProps: {
        ...defaultInstanceProps,
        ...props?.instanceProps
      }
    }

    this.node.addValidation({
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
    return this.calculatedProps.storageEncrypted
      ? []
      : ['storageEncrypted must be true']
  }

  protected checkIAMAuthentication () {
    return this.calculatedProps.iamAuthentication
      ? []
      : ['iamAuthentication must be true']
  }

  protected checkCopyTags () {
    return this.calculatedProps.copyTagsToSnapshot
      ? []
      : ['copyTagsToSnapshot must be true']
  }

  protected checkDeletionProtection () {
    return this.calculatedProps.deletionProtection
      ? []
      : ['deletionProtection must be true']
  }

  protected checkPubliclyAccessible () {
    return !this.calculatedProps.instanceProps.publiclyAccessible
      ? []
      : ['publiclyAccessible must be false']
  }

  protected checkAutoUpgrade () {
    return this.calculatedProps.instanceProps.autoMinorVersionUpgrade
      ? []
      : ['autoMinorVersionUpgrade must be true']
  }
}
