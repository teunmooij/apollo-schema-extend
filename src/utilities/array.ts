import { find, filter } from 'ramda'

export const findByType = <T, U extends T>(typeGuard: (value: T) => value is U, list: readonly T[]): U | undefined =>
  find(typeGuard, list) as U | undefined

export const filterByType = <T, U extends T>(typeGuard: (value: T) => value is U, list: readonly T[]): U[] =>
  filter(typeGuard, list) as U[]
