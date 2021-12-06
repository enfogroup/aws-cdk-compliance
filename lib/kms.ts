import { Key as KMSKey, KeyProps } from 'aws-cdk-lib/aws-kms'
import { Construct } from 'constructs'

/**
 * Properties for a new Compliant KMS Key
 */
export const defaultKeyProps: KeyProps = {
  enableKeyRotation: true
}

/**
 * Compliant KMS Key.
 *
 * See README for usage examples
 */
export class Key extends KMSKey {
  protected calculatedProps: KeyProps
  constructor (scope: Construct, id: string, props?: KeyProps) {
    super(scope, id, {
      ...defaultKeyProps,
      ...props
    })
    this.calculatedProps = {
      ...defaultKeyProps,
      ...props
    }

    this.node.addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  protected checkEncryption () {
    return this.calculatedProps.enableKeyRotation
      ? []
      : ['enableKeyRotation must be true']
  }
}
