import {
  BehaviorOptions as CFBehaviorOptions,
  Distribution as CFDistribution,
  DistributionProps as CFDistributionProps,
  ViewerProtocolPolicy as CFViewerProtocolPolicy
} from 'aws-cdk-lib/aws-cloudfront'
import { Construct } from 'constructs'

export interface BehaviorOptions extends CFBehaviorOptions {
  readonly viewerProtocolPolicy: Exclude<CFViewerProtocolPolicy, CFViewerProtocolPolicy.ALLOW_ALL>
}

export interface DistributionProps extends CFDistributionProps {
  readonly defaultBehavior: BehaviorOptions
  readonly additionalBehaviors?: Record<string, BehaviorOptions>
}

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
  // eslint-disable-next-line no-useless-constructor
  constructor (scope: Construct, id: string, props?: DistributionProps) {
    super(scope, id, {
      ...defaultDistributionProps,
      ...props
    } as InternalDistributionProps)
  }
}
