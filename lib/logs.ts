import {
  LogGroup as CWLogGroup,
  LogGroupProps,
  RetentionDays
} from 'aws-cdk-lib/aws-logs'
import { Construct, Node } from 'constructs'

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
  myProps: LogGroupProps
  constructor (scope: Construct, id: string, props?: LogGroupProps) {
    super(scope, id, {
      ...defaultLogGroupProps,
      ...props
    })
    this.myProps = {
      ...defaultLogGroupProps,
      ...props
    }

    Node.of(this).addValidation({
      validate: () => {
        return [
          ...this.checkRetention()
        ]
      }
    })
  }

  private checkRetention (): string[] {
    return this.myProps.retention
      ? []
      : ['retention must be set']
  }
}
