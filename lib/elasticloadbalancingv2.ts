import {
  ApplicationLoadBalancer as LBApplicationLoadBalancer,
  ApplicationLoadBalancerProps as LBApplicationLoadBalancerProps
} from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { Construct, Node } from 'constructs'

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
  protected myAttributes: { [ k: string ]: string | undefined }
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props?: ApplicationLoadBalancerProps) {
    super(scope, id, {
      ...defaultApplicationLoadBalancerProps,
      ...props
    } as InternalApplicationLoadBalancerProps)
    this.setAttribute('routing.http.drop_invalid_header_fields.enabled', 'true')

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkLogging(),
          ...this.checkDropInvalidHeaders(),
          ...this.checkDeletionProtection()
        ]
      }
    })
  }

  public setAttribute (key: string, value: string | undefined) {
    if (!this.myAttributes) {
      this.myAttributes = {}
    }
    this.myAttributes[key] = value
    return super.setAttribute(key, value)
  }

  protected checkLogging () {
    return this.myAttributes['access_logs.s3.enabled'] === 'true'
      ? []
      : ['Access logs not enabled']
  }

  protected checkDeletionProtection () {
    return this.myAttributes['deletion_protection.enabled'] === 'true'
      ? []
      : ['Deletion protection not enabled']
  }

  protected checkDropInvalidHeaders () {
    return this.myAttributes['routing.http.drop_invalid_header_fields.enabled'] === 'true'
      ? []
      : ['Not configured to drop invalid HTTP headers']
  }
}
