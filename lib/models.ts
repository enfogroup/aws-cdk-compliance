/**
 * Used to pick keys required to make a Construct compliant.
 * The returned keys will be readonly and required.
 */
export type PickRequiredKeys<T, K extends keyof T> = Readonly<Required<Pick<T, K>>>
