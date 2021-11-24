import { Key as KMSKey, KeyProps } from '@aws-cdk/aws-kms'
import { Construct } from '@aws-cdk/core'

/**
 * Compliant KeyProps. Can be manually spread into a Key constructor.
 *
 * See README for usage examples
 */
export const compliantKeyProps: Readonly<Required<Pick<KeyProps, 'enableKeyRotation'>>> = {
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
