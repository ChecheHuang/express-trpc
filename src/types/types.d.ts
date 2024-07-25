type AnyObject = Record<string | number, any>
type Override<P, S> = Omit<P, keyof S> & S
type PartialByKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
type Callback = () => void
type Nullable<T> = T | null
type FnInputType<T extends (...args: any[]) => any> = Parameters<T>
type GetAsyncFnReturnType<T extends (...args: any) => Promise<any>> = Awaited<ReturnType<T>>
type GetArrType<T> = T extends (infer U)[] ? U : never
type Prettify<T> = {
  [K in keyof T]: T[K] extends object ? Prettify<T[K]> : T[K];
}
