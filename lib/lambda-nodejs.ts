import {
  NodejsFunction as LambdaNodejsFunction,
  NodejsFunctionProps
} from 'aws-cdk-lib/aws-lambda-nodejs'
import { Runtime } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'

const getNameFromRuntime = (runtime: Runtime): string => runtime.name

/**
 * Valid runtimes, does not contain custom runtimes
 */
export const validRuntimes = [
  Runtime.NODEJS_16_X
]

const blackList: string[] = [
  Runtime.NODEJS,
  Runtime.NODEJS_4_3,
  Runtime.NODEJS_6_10,
  Runtime.NODEJS_8_10,
  Runtime.NODEJS_10_X,
  Runtime.NODEJS_14_X
].map(getNameFromRuntime)

const latestVersions: Record<string, string> = {
  [getNameFromRuntime(Runtime.NODEJS)]: 'NODEJS_16_X',
  [getNameFromRuntime(Runtime.NODEJS_4_3)]: 'NODEJS_16_X',
  [getNameFromRuntime(Runtime.NODEJS_6_10)]: 'NODEJS_16_X',
  [getNameFromRuntime(Runtime.NODEJS_8_10)]: 'NODEJS_16_X',
  [getNameFromRuntime(Runtime.NODEJS_10_X)]: 'NODEJS_16_X',
  [getNameFromRuntime(Runtime.NODEJS_12_X)]: 'NODEJS_16_X',
  [getNameFromRuntime(Runtime.NODEJS_14_X)]: 'NODEJS_16_X'
}

/**
 * Compliant NodeJS Lambda Function.
 *
 * See README for usage examples
 */
export class NodejsFunction extends LambdaNodejsFunction {
  constructor (scope: Construct, id: string, props: NodejsFunctionProps) {
    const { runtime = Runtime.NODEJS_16_X, ...rest } = props
    super(scope, id, {
      runtime,
      ...rest
    })
    this.node.addValidation({
      validate: () => {
        return [
          ...this.checkRuntime()
        ]
      }
    })
  }

  protected checkRuntime () {
    const runtime = getNameFromRuntime(this.runtime)
    return (blackList.includes(runtime))
      ? [`Lambda runtime must be latest runtime available for language. Found ${runtime}, please use ${latestVersions[runtime]} instead`]
      : []
  }
}
