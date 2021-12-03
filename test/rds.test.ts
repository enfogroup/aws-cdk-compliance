// to be tested
import { DatabaseInstance } from '../lib/rds'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'
import { Vpc } from '@aws-cdk/aws-ec2'
import { DatabaseInstanceEngine, PostgresEngineVersion } from '@aws-cdk/aws-rds'

describe('RDS', () => {
  describe('DatabaseInstance', () => {
    it('should have sane defaults', () => {
      const stack = new Stack()
      const vpc = new Vpc(stack, 'VPC')

      new DatabaseInstance(stack, 'DB', { vpc, engine: DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_13_4 }) })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::RDS::DBInstance', Match.objectLike({
        PubliclyAccessible: false
      }))
    })
  })
})

