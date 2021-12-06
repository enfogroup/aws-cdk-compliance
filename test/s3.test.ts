// to be tested
import * as s3 from '../lib/s3'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'
import { BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3'

describe('S3', () => {
  describe('Bucket', () => {
    it('should enforce SSL', () => {
      const stack = new Stack()

      new s3.Bucket(stack, 'Bucket', { })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::S3::BucketPolicy', Match.objectLike({
        PolicyDocument: {
          Statement: [
            {
              Action: 's3:*',
              Condition: {
                Bool: {
                  'aws:SecureTransport': 'false'
                }
              },
              Effect: 'Deny',
              Principal: {
                AWS: '*'
              },
              Resource: [
                {
                  'Fn::GetAtt': [
                    Match.anyValue(),
                    'Arn'
                  ]
                },
                {
                  'Fn::Join': [
                    '',
                    [
                      {
                        'Fn::GetAtt': [
                          Match.anyValue(),
                          'Arn'
                        ]
                      },
                      '/*'
                    ]
                  ]
                }
              ]
            }
          ]
        }
      }))
    })

    it('should set encryption', () => {
      const stack = new Stack()

      new s3.Bucket(stack, 'Bucket', { })

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        BucketEncryption: {
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256'
              }
            }
          ]
        }
      })
    })

    it('should block public access', () => {
      const stack = new Stack()

      new s3.Bucket(stack, 'Bucket', { })

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true
        }
      })
    })

    it('should throw if not blocking public access', () => {
      const stack = new Stack()

      new s3.Bucket(stack, 'Bucket', { blockPublicAccess: BlockPublicAccess.BLOCK_ACLS })

      expect(() => Template.fromStack(stack)).toThrow('blockPublicAccess must be BLOCK_ALL')
    })

    it('should throw if not encrypted', () => {
      const stack = new Stack()

      new s3.Bucket(stack, 'Bucket', { encryption: BucketEncryption.UNENCRYPTED })

      expect(() => Template.fromStack(stack)).toThrow('bucket must be encrypted')
    })
  })
})
