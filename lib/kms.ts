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
  #enableKeyRotation: boolean | undefined
  constructor (scope: Construct, id: string, props?: KeyProps) {
    super(scope, id, {
      ...defaultKeyProps,
      ...props
    })
    const calculatedProps = {
      ...defaultKeyProps,
      ...props
    }
    this.#enableKeyRotation = calculatedProps.enableKeyRotation

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkEncryption()
        ]
      }
    })
  }

  private checkEncryption () {
    return this.#enableKeyRotation !== undefined && this.#enableKeyRotation
      ? []
      : ['KMS Key must have key rotation enabled.']
  }
}
