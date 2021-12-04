import { Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda'

const getNameFromRuntime = (runtime: Runtime): string => runtime.name

/**
 * Valid runtimes, does not contain custom runtimes
 */
export const validRuntimes = [
  Runtime.DOTNET_CORE_3_1,
  Runtime.GO_1_X,
  Runtime.JAVA_11,
  Runtime.NODEJS_14_X,
  Runtime.PYTHON_3_9,
  Runtime.RUBY_2_7
]

const blackList: string[] = [
  Runtime.DOTNET_CORE_1,
  Runtime.DOTNET_CORE_2,
  Runtime.DOTNET_CORE_2_1,
  Runtime.NODEJS,
  Runtime.NODEJS_4_3,
  Runtime.NODEJS_6_10,
  Runtime.NODEJS_8_10,
  Runtime.NODEJS_10_X,
  Runtime.NODEJS_12_X,
  Runtime.PYTHON_2_7,
  Runtime.PYTHON_3_6,
  Runtime.PYTHON_3_7,
  Runtime.PYTHON_3_8,
  Runtime.RUBY_2_5,
  Runtime.JAVA_8,
  Runtime.JAVA_8_CORRETTO
].map(getNameFromRuntime)

const latestVersions: Record<string, string> = {
  [getNameFromRuntime(Runtime.DOTNET_CORE_1)]: 'DOTNET_CORE_3_1',
  [getNameFromRuntime(Runtime.DOTNET_CORE_1)]: 'DOTNET_CORE_3_1',
  [getNameFromRuntime(Runtime.DOTNET_CORE_1)]: 'DOTNET_CORE_3_1',
  [getNameFromRuntime(Runtime.NODEJS)]: 'NODEJS_14_X',
  [getNameFromRuntime(Runtime.NODEJS_4_3)]: 'NODEJS_14_X',
  [getNameFromRuntime(Runtime.NODEJS_6_10)]: 'NODEJS_14_X',
  [getNameFromRuntime(Runtime.NODEJS_8_10)]: 'NODEJS_14_X',
  [getNameFromRuntime(Runtime.NODEJS_10_X)]: 'NODEJS_14_X',
  [getNameFromRuntime(Runtime.NODEJS_12_X)]: 'NODEJS_14_X',
  [getNameFromRuntime(Runtime.PYTHON_2_7)]: 'PYTHON_3_9',
  [getNameFromRuntime(Runtime.PYTHON_3_6)]: 'PYTHON_3_9',
  [getNameFromRuntime(Runtime.PYTHON_3_7)]: 'PYTHON_3_9',
  [getNameFromRuntime(Runtime.PYTHON_3_8)]: 'PYTHON_3_9',
  [getNameFromRuntime(Runtime.RUBY_2_5)]: 'RUBY_2_7',
  [getNameFromRuntime(Runtime.JAVA_8)]: 'JAVA_11',
  [getNameFromRuntime(Runtime.JAVA_8_CORRETTO)]: 'JAVA_11'
}

export class Function extends LambdaFunction {
  protected validate () {
    return [
      ...this.checkRuntime()
    ]
  }

  protected checkRuntime () {
    const runtime = getNameFromRuntime(this.runtime)
    return (blackList.includes(runtime))
      ? [`Lambda runtime must be latest runtime available for language. Found ${runtime}, please use ${latestVersions[runtime]} instead`]
      : []
  }
}
