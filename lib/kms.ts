import { Key as KMSKey, KeyProps as KMSKeyProps } from '@aws-cdk/aws-kms'
import { Construct } from '@aws-cdk/core'

export interface KeyProps extends KMSKeyProps {
  enableKeyRotation?: true
}

/**
 * Compliant KeyProps. Can be manually spread into a Key constructor.
 *
 * See README for usage examples
 */
export const compliantKeyProps: KeyProps = {
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
      ...compliantKeyProps,
      ...props
    })
  }
}
