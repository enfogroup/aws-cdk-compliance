import {
  BehaviorOptions,
  Distribution as CFDistribution,
  DistributionProps,
  ViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront'
import { Construct, Node } from 'constructs'

/**
 * Properties for a new Compliant CloudFront Distribution
 */
export const defaultDistributionProps = {
  defaultRootObject: 'index.html',
  enableLogging: true,
  defaultBehavior: {
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
  }
}

/**
 * Compliant CloudFront Distribution
 *
 * See README for usage examples
 */
export class Distribution extends CFDistribution {
  myProps: DistributionProps
  constructor (scope: Construct, id: string, props: DistributionProps) {
    super(scope, id, {
      ...defaultDistributionProps,
      ...props,
      defaultBehavior: {
        ...defaultDistributionProps.defaultBehavior,
        ...props.defaultBehavior
      }
    })
    this.myProps = {
      ...defaultDistributionProps,
      ...props,
      defaultBehavior: {
        ...defaultDistributionProps.defaultBehavior,
        ...props.defaultBehavior
      }
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkRootObject(),
          ...this.checkLogging(),
          ...this.checkWebAcl(),
          ...this.checkProtocolPolicies()
        ]
      }
    })
  }

  private checkRootObject (): string[] {
    return this.myProps.defaultRootObject
      ? []
      : ['defaultRootObject must be set']
  }

  private checkLogging (): string[] {
    return this.myProps.enableLogging
      ? []
      : ['logging must be enabled']
  }

  private checkWebAcl (): string[] {
    return this.myProps.webAclId
      ? []
      : ['must be associated with a web acl']
  }

  private checkProtocolPolicies (): string[] {
    return [
      ...this.checkDefaultBehaviorProtocolPolicy(),
      ...this.checkAdditionalBehaviorsProtocolPolicies()
    ]
  }

  private checkDefaultBehaviorProtocolPolicy (): string[] {
    return this.checkProtocolPolicy(this.myProps.defaultBehavior.viewerProtocolPolicy)
  }

  private checkAdditionalBehaviorsProtocolPolicies (): string[] {
    if (!this.myProps.additionalBehaviors) {
      return []
    }
    return Object.values(this.myProps.additionalBehaviors).map((behavior: BehaviorOptions): string[] => {
      return this.checkProtocolPolicy(behavior.viewerProtocolPolicy)
    }).flat()
  }

  private checkProtocolPolicy (policy: ViewerProtocolPolicy | undefined): string[] {
    return policy !== undefined && policy !== ViewerProtocolPolicy.ALLOW_ALL
      ? []
      : ['ViewerProtocolPolicy must not be undefined nor "ALLOW_ALL"']
  }
}
