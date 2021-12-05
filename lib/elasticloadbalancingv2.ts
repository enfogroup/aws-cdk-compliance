import {
  ApplicationLoadBalancer as LBApplicationLoadBalancer,
  ApplicationLoadBalancerProps
} from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import { Construct, Node } from 'constructs'

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
  #props: ApplicationLoadBalancerProps
  protected internalAttributes: Record<string, string> = {}
  constructor (scope: Construct, id: string, props: ApplicationLoadBalancerProps) {
    super(scope, id, {
      ...defaultApplicationLoadBalancerProps,
      ...props
    } as InternalApplicationLoadBalancerProps)

    this.#props = {
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

  public setAttribute (key: string, value: string) {
    if (!this.internalAttributes) {
      this.internalAttributes = {}
    }
    this.internalAttributes[key] = value
    return super.setAttribute(key, value)
  }

  protected checkLogging () {
    return this.internalAttributes['access_logs.s3.enabled']
      ? []
      : ['Access logs not enabled']
  }

  protected checkDeletionProtection () {
    const deletionProtection = this.#props.deletionProtection
    return deletionProtection !== undefined && deletionProtection
      ? []
      : ['deletionProtection must not be undefined nor false']
  }

  protected checkDropInvalidHeaders () {
    return this.internalAttributes['routing.http.drop_invalid_header_fields.enabled'] === 'true'
      ? []
      : ['Not configured to drop invalid HTTP headers']
  }
}
