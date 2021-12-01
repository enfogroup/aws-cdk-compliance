// to be tested
import { ApplicationLoadBalancer } from '../lib/elasticloadbalancingv2'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'
import { IVpc } from '@aws-cdk/aws-ec2'

describe('ElasticLoadBalancingV2', () => {
  describe('ALB', () => {
    it('should have sane defaults', () => {
      const stack = new Stack(),
        vpc = {
          vpcId: 'vpc-123',
          selectSubnets: () => ({
            availabilityZones: [ 'eu-west-1a', 'eu-west-1b', 'eu-west-1c' ],
            publicSubnets: [
              {
                availabilityZone: 'eu-west-1a',
                subnetId: 'subnet-1',
              },
              {
                availabilityZone: 'eu-west-1b',
                subnetId: 'subnet-2',
              },
              {
                availabilityZone: 'eu-west-1c',
                subnetId: 'subnet-3',
              },
            ]
          }),
        } as unknown as IVpc

      new ApplicationLoadBalancer(stack, 'ALB', { vpc })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::ElasticLoadBalancingV2::LoadBalancer', Match.objectLike({
        Type: 'application',
        LoadBalancerAttributes: [ {
          Key: 'deletion_protection.enabled',
          Value: 'true'
        } ],
      }))
    })
  })
})
