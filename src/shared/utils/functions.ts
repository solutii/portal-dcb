export const debounce = (fn: Function, timeout: number) => {
  let timer: any

  return function (this: any, ...args: any[]) {
    const context = this

    if (timer) 
      clearTimeout(timer)

    timer = setTimeout(() => {
      timer = null
      fn.apply(context, args)
    }, timeout)
  }
}
