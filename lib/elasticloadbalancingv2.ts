import {
  ApplicationLoadBalancer as LBApplicationLoadBalancer,
  ApplicationLoadBalancerProps as LBApplicationLoadBalancerProps,
} from '@aws-cdk/aws-elasticloadbalancingv2'
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
  // eslint-disable-next-line no-useless-constructor
  constructor(scope: Construct, id: string, props?: ApplicationLoadBalancerProps) {
    super(scope, id, {
      ...defaultApplicationLoadBalancerProps,
      ...props
    } as InternalApplicationLoadBalancerProps)
  }
  validate() {
    return [
      ...this.checkLogging(),
    ]
  }
  checkLogging() {
    return this.attributes[ 'access_logs.s3.enabled' ] === 'true'
      ? []
      : [ 'Access logs not enabled' ]
  }
}
