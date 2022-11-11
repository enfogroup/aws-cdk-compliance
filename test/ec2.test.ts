// to be tested
import { Instance } from '../lib/ec2'

// tools
import '@aws-cdk/assert/jest'
import { Vpc, InstanceType, MachineImage } from 'aws-cdk-lib/aws-ec2'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

describe('EC2', () => {
  describe('Instance', () => {
    it('should require IMDSv2 by default', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')
      new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t4g.medium'),
        machineImage: MachineImage.genericLinux({ region: 'ami-123' })
      })
      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::EC2::LaunchTemplate', Match.objectLike({
        LaunchTemplateData: {
          MetadataOptions: {
            HttpTokens: 'required'
          }
        }
      }))
    })

    it('should throw if not requiring IMDSv2', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')
      new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t4g.medium'),
        machineImage: MachineImage.genericLinux({ region: 'ami-123' }),
        requireImdsv2: false
      })
      expect(() => Template.fromStack(stack)).toThrow('IMDSv2 is required')
    })

    it('should throw if enabling SSH', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')
      new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('t4g.medium'),
        machineImage: MachineImage.genericLinux({ region: 'ami-123' }),
        keyName: 'my-key'
      })
      expect(() => Template.fromStack(stack)).toThrow('Use SSM Session Manager rather than SSH')
    })

    it('should throw if using old instance types', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')
      new Instance(stack, 'Instance', {
        vpc,
        instanceType: new InstanceType('m1.medium'),
        machineImage: MachineImage.genericLinux({ region: 'ami-123' })
      })
      expect(() => Template.fromStack(stack)).toThrow('Use current instance types')
    })
  })
})
