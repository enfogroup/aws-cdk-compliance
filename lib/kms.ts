import { Key as KMSKey, KeyProps } from 'aws-cdk-lib/aws-kms'
import { Construct, Node } from 'constructs'

/**
 * Properties for a new Compliant KMS Key
 */
export const defaultKeyProps: KeyProps = {
  enableKeyRotation: true
}

/**
 * Compliant KMS Key.
 * Key rotation will be enabled.
 *
 * See README for usage examples
 */
export class Key extends KMSKey {
  myProps: KeyProps
  constructor (scope: Construct, id: string, props?: KeyProps) {
    super(scope, id, {
      ...defaultKeyProps,
      ...props
    })
    this.myProps = {
      ...defaultKeyProps,
      ...props
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  private checkEncryption () {
    return this.myProps.enableKeyRotation
      ? []
      : ['enableKeyRotation must be true']
  }
}
