import { List } from "./list"

export type IO<T> = () => T

export const nop = () => {}

export const id = <T>(x: T) => x

export const sequenceIO = (list: List<IO<unknown>>): IO<void> => 
  () => {
    list.forEach(it => it())
  }