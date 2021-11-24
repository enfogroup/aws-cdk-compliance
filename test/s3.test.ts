// to be tested
import { Bucket } from '../lib/s3'

// tools
import '@aws-cdk/assert/jest'
import { Stack } from '@aws-cdk/core'
import { Template, Match } from '@aws-cdk/assertions'

describe('S3', () => {
  describe('S3Defaults', () => {
    it('should enforce SSL', () => {
      const stack = new Stack()

      new Bucket(stack, 'Bucket', { })

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

      new Bucket(stack, 'Bucket', { })

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

      new Bucket(stack, 'Bucket', { })

      expect(stack).toHaveResource('AWS::S3::Bucket', {
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: true,
          BlockPublicPolicy: true,
          IgnorePublicAcls: true,
          RestrictPublicBuckets: true
        }
      })
    })
  })
})
