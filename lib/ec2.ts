import { Instance as Ec2Instance, InstanceProps, InstanceClass } from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'
import { anyPass, startsWith } from './common'

/**
 * Properties for a new Compliant EC2 instance
 */
export const defaultProps = {
  requireImdsv2: true
}

/**
 * Compliant EC2 instance.
 *
 * See README for usage examples
 */
export class Instance extends Ec2Instance {
  protected calculatedProps: InstanceProps
  constructor(scope: Construct, id: string, props: InstanceProps) {
    super(scope, id, {
      ...defaultProps,
      ...props
    })
    this.calculatedProps = {
      ...defaultProps,
      ...props
    }

    this.node.addValidation({
      validate: () => {
        return [
          ...this.checkImdsv2(),
          ...this.checkNoSSH(),
          ...this.checkInstanceType()
        ]
      }
    })
  }

  protected checkImdsv2() {
    return (!this.calculatedProps.requireImdsv2)
      ? [ 'IMDSv2 is required' ]
      : []
  }

  protected checkNoSSH() {
    return (this.calculatedProps.keyName)
      ? [ 'Use SSM Session Manager rather than SSH' ]
      : []
  }

  protected checkInstanceType() {
    return (anyPass(Object.values(InstanceClass).map(startsWith))(this.calculatedProps.instanceType.toString()))
      ? []
      : [ 'Use current instance types' ]
  }
}
