import {
  LogGroup as CWLogGroup,
  LogGroupProps,
  RetentionDays
} from 'aws-cdk-lib/aws-logs'
import { Construct } from 'constructs'

/**
 * Properties for a new Compliant Log Group
 */
export const defaultLogGroupProps = {
  retention: RetentionDays.ONE_MONTH
}

/**
 * Compliant Log Group
 *
 * See README for usage examples
 */
export class LogGroup extends CWLogGroup {
  protected calculatedProps: LogGroupProps
  constructor (scope: Construct, id: string, props?: LogGroupProps) {
    super(scope, id, {
      ...defaultLogGroupProps,
      ...props
    })
    this.calculatedProps = {
      ...defaultLogGroupProps,
      ...props
    }

    this.node.addValidation({
      validate: () => {
        return [
          ...this.checkRetention()
        ]
      }
    })
  }

  protected checkRetention (): string[] {
    return this.calculatedProps.retention
      ? []
      : ['retention must be set']
  }
}
