// to be tested
import { ApplicationLoadBalancer } from '../lib/elasticloadbalancingv2'

// tools
import '@aws-cdk/assert/jest'
import { Vpc } from 'aws-cdk-lib/aws-ec2'
import { Bucket } from '../lib/s3'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

describe('ElasticLoadBalancingV2', () => {
  describe('ALB', () => {
    it('should have sane defaults', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'eu-west-1' } })
      const vpc = new Vpc(stack, 'VPC')
      const bucket = new Bucket(stack, 'Bucket')

      const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc })
      alb.logAccessLogs(bucket)

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', Match.objectLike({
        Type: 'application',
        LoadBalancerAttributes: [
          {
            Key: 'deletion_protection.enabled',
            Value: 'true'
          },
          {
            Key: 'routing.http.drop_invalid_header_fields.enabled',
            Value: 'true'
          },
          {
            Key: 'access_logs.s3.enabled',
            Value: 'true'
          },
          {
            Key: 'access_logs.s3.bucket',
            Value: { Ref: Match.anyValue() }
          },
          {
            Key: 'access_logs.s3.prefix',
            Value: ''
          }
        ]
      }))
    })

    it('should throw if logging is not enabled', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'eu-west-1' } })
      const vpc = new Vpc(stack, 'VPC')

      new ApplicationLoadBalancer(stack, 'ALB', { vpc })

      expect(() => Template.fromStack(stack)).toThrow('Access logs not enabled')
    })

    it('should throw if drop invalid headers is not enabled', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'eu-west-1' } })
      const vpc = new Vpc(stack, 'VPC')

      const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc })
      alb.setAttribute('routing.http.drop_invalid_header_fields.enabled')

      expect(() => Template.fromStack(stack)).toThrow('Not configured to drop invalid HTTP headers')
    })

    it('should throw if deletionProtection is undefined', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'eu-west-1' } })
      const vpc = new Vpc(stack, 'VPC')
      const bucket = new Bucket(stack, 'Bucket')

      const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc, deletionProtection: undefined })
      alb.logAccessLogs(bucket)

      expect(() => Template.fromStack(stack)).toThrow('deletionProtection must be enabled')
    })

    it('should throw if deletionProtection is false', () => {
      const stack = new Stack(undefined, undefined, { env: { region: 'eu-west-1' } })
      const vpc = new Vpc(stack, 'VPC')
      const bucket = new Bucket(stack, 'Bucket')

      const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc, deletionProtection: false })
      alb.logAccessLogs(bucket)

      expect(() => Template.fromStack(stack)).toThrow('deletionProtection must be enabled')
    })
  })
})
