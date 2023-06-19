export const anyPass = <T>(fns: ((a: T) => boolean)[]) => (x: T) =>
  fns.reduce((acc, fn) => acc || fn(x), false)

export const startsWith = (s1: string) => (s2: string) => s2.startsWith(s1)
