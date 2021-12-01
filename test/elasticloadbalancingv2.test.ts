// to be tested
import { ApplicationLoadBalancer } from '../lib/elasticloadbalancingv2'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'
import { Vpc } from '@aws-cdk/aws-ec2'
import { Bucket } from '../lib/s3'
import { CfnBucket } from '@aws-cdk/aws-s3'

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
            Key: 'access_logs.s3.enabled',
            Value: 'true'
          },
          {
            Key: 'access_logs.s3.bucket',
            Value: { Ref: stack.getLogicalId(bucket.node.defaultChild as CfnBucket) }
          },
          {
            Key: 'access_logs.s3.prefix',
            Value: ''
          }
        ]
      }))
    })
  })
})
