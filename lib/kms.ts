import { Key as KMSKey, KeyProps as KMSKeyProps } from '@aws-cdk/aws-kms'
import { Construct } from '@aws-cdk/core'

export interface KeyProps extends KMSKeyProps {
  readonly enableKeyRotation?: true
}

interface InternalKeyProps extends KeyProps {
  readonly enableKeyRotation: true;
}

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
  constructor (scope: Construct, id: string, props?: KeyProps) {
    super(scope, id, {
      ...defaultKeyProps,
      ...props
    } as InternalKeyProps)
  }
}
