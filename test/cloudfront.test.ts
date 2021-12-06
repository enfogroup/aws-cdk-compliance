// to be tested
import { Distribution } from '../lib/cloudfront'

// tools
import '@aws-cdk/assert/jest'
import { ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Stack } from 'aws-cdk-lib'
import { Match, Template } from 'aws-cdk-lib/assertions'

describe('CloudFront', () => {
  describe('Distribution', () => {
    it('should have sane defaults', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultBehavior: {
          origin: new HttpOrigin('example.com')
        },
        webAclId: 'some-id'
      })

      const template = Template.fromStack(stack)
      template.hasResourceProperties('AWS::CloudFront::Distribution', Match.objectLike({
        DistributionConfig: {
          DefaultRootObject: 'index.html',
          DefaultCacheBehavior: {
            ViewerProtocolPolicy: 'redirect-to-https'
          },
          Logging: {
            Bucket: {}
          },
          WebACLId: 'some-id'
        }
      }))
    })

    it('should throw if no default root object', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultRootObject: '',
        defaultBehavior: {
          origin: new HttpOrigin('example.com')
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('defaultRootObject must be set')
    })

    it('should throw if no logging', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        enableLogging: false,
        defaultBehavior: {
          origin: new HttpOrigin('example.com')
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('logging must be enabled')
    })

    it('should throw if no web acl', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultBehavior: {
          origin: new HttpOrigin('example.com')
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('must be associated with a web acl')
    })

    it('should throw if defaultBehavior has viewerProtocolPolicy set to undefined', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultBehavior: {
          origin: new HttpOrigin('example.com'),
          viewerProtocolPolicy: undefined
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('ViewerProtocolPolicy must not be undefined nor "ALLOW_ALL"')
    })

    it('should throw if defaultBehavior has viewerProtocolPolicy set to ALLOW_ALL', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultBehavior: {
          origin: new HttpOrigin('example.com'),
          viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('ViewerProtocolPolicy must not be undefined nor "ALLOW_ALL"')
    })

    it('should throw if an additionalBehaviors has viewerProtocolPolicy set to undefined', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultBehavior: {
          origin: new HttpOrigin('example.com'),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY
        },
        additionalBehaviors: {
          example: {
            origin: new HttpOrigin('example.com'),
            viewerProtocolPolicy: undefined
          }
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('ViewerProtocolPolicy must not be undefined nor "ALLOW_ALL"')
    })

    it('should throw if an additionalBehaviors has viewerProtocolPolicy set to ALLOW_ALL', () => {
      const stack = new Stack()

      new Distribution(stack, 'Distribution', {
        defaultBehavior: {
          origin: new HttpOrigin('example.com'),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY
        },
        additionalBehaviors: {
          example: {
            origin: new HttpOrigin('example.com'),
            viewerProtocolPolicy: ViewerProtocolPolicy.ALLOW_ALL
          }
        }
      })

      expect(() => Template.fromStack(stack)).toThrow('ViewerProtocolPolicy must not be undefined nor "ALLOW_ALL"')
    })
  })
})
