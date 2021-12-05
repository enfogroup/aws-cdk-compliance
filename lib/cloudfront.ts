import {
  BehaviorOptions,
  Distribution as CFDistribution,
  DistributionProps,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront'
import { Construct, Node } from 'constructs'

interface InternalDistributionProps extends DistributionProps {
  readonly defaultRootObject: string
  readonly enableLogging: true
  readonly webAclId: string
}

/**
 * Properties for a new Compliant CloudFront Distribution
 */
export const defaultDistributionProps = {
  defaultRootObject: 'index.html',
  enableLogging: true
}

/**
 * Compliant CloudFront Distribution
 *
 * See README for usage examples
 */
export class Distribution extends CFDistribution {
  #props: DistributionProps
  constructor (scope: Construct, id: string, props: DistributionProps) {
    super(scope, id, {
      ...defaultDistributionProps,
      ...props
    } as InternalDistributionProps)

    this.#props = {
      ...defaultDistributionProps,
      ...props
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkProtocolPolicies()
        ]
      }
    })
  }

  private checkProtocolPolicies (): string[] {
    return [
      ...this.checkDefaultBehaviorProtocolPolicy(),
      ...this.checkAdditionalBehaviorsProtocolPolicies()
    ]
  }

  private checkDefaultBehaviorProtocolPolicy (): string[] {
    return this.checkProtocolPolicy(this.#props.defaultBehavior.viewerProtocolPolicy)
  }

  private checkAdditionalBehaviorsProtocolPolicies (): string[] {
    if (!this.#props.additionalBehaviors) {
      return []
    }
    return Object.values(this.#props.additionalBehaviors).map((behavior: BehaviorOptions): string[] => {
      return this.checkProtocolPolicy(behavior.viewerProtocolPolicy)
    }).flat()
  }

  private checkProtocolPolicy (policy: ViewerProtocolPolicy | undefined): string[] {
    return policy !== undefined && policy !== ViewerProtocolPolicy.ALLOW_ALL
      ? []
      : ['ViewerProtocolPolicy must not be undefined nor "ALLOW_ALL"']
  }
}
