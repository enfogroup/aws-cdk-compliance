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
          origin: new HttpOrigin('example.com'),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS
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
  })
})
