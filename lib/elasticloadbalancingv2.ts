import {
  ApplicationLoadBalancer as LBApplicationLoadBalancer,
  ApplicationLoadBalancerProps
} from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { Construct, Node } from 'constructs'

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
  myProps: ApplicationLoadBalancerProps
  protected internalAttributes: Record<string, string> = {}
  constructor (scope: Construct, id: string, props: ApplicationLoadBalancerProps) {
    super(scope, id, {
      ...defaultApplicationLoadBalancerProps,
      ...props
    })

    this.myProps = {
      ...defaultApplicationLoadBalancerProps,
      ...props
    }
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

  public setAttribute (key: string, value?: string) {
    if (!this.internalAttributes) {
      this.internalAttributes = {}
    }
    if (value === undefined) {
      delete this.internalAttributes[key]
    } else {
      this.internalAttributes[key] = value
    }
    return super.setAttribute(key, value)
  }

  protected checkLogging () {
    return this.internalAttributes['access_logs.s3.enabled']
      ? []
      : ['Access logs not enabled']
  }

  protected checkDeletionProtection () {
    return this.myProps.deletionProtection
      ? []
      : ['deletionProtection must be enabled']
  }

  protected checkDropInvalidHeaders () {
    return this.internalAttributes['routing.http.drop_invalid_header_fields.enabled'] === 'true'
      ? []
      : ['Not configured to drop invalid HTTP headers']
  }
}
