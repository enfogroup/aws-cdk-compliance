import {
  ApplicationLoadBalancer as LBApplicationLoadBalancer,
  ApplicationLoadBalancerProps as LBApplicationLoadBalancerProps
} from '@aws-cdk/aws-elasticloadbalancingv2'
import type { IBucket } from '@aws-cdk/aws-s3'
import { Construct } from '@aws-cdk/core'

export interface ApplicationLoadBalancerProps extends LBApplicationLoadBalancerProps {
  readonly deletionProtection?: true
}

interface InternalApplicationLoadBalancerProps extends ApplicationLoadBalancerProps {
  readonly deletionProtection: true
}

/**
 * Properties for a new Compliant ALB
 */
export const defaultApplicationLoadBalancerProps = {
  deletionProtection: true
}

/**
 * Compliant ALB
 *
 * See README for usage examples
 */
export class ApplicationLoadBalancer extends LBApplicationLoadBalancer {
  protected loggingEnabled = false
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props?: ApplicationLoadBalancerProps) {
    super(scope, id, {
      ...defaultApplicationLoadBalancerProps,
      ...props
    } as InternalApplicationLoadBalancerProps)
  }

  public logAccessLogs (bucket: IBucket, prefix?: string) {
    this.loggingEnabled = true
    return super.logAccessLogs(bucket, prefix)
  }

  protected validate () {
    return [
      ...this.checkLogging()
    ]
  }

  protected checkLogging () {
    return this.loggingEnabled
      ? []
      : ['Access logs not enabled']
  }
}
