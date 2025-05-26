export const emailPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

// /^((?!\.)[\w-]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W]){2,4}$/g

export const cpfPattern: RegExp = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/g

export const cnpjPattern: RegExp = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/g

export const cnpjCpfPattern: RegExp = /^\d{11}|\d{14}$/g