import { Codec, enumCodec, listCodec, optionalCodec } from "./codec"
import { List } from "./list"
import { StringT } from "./serialization"

export type Json = unknown

export type Model<T> = {
    codec: Codec<T, Json>,
    check: (value: unknown) => value is T
}

export type EnumModel<T> = Model<T> & {
  values: List<T>
}

export type Obtain<M> = M extends Model<infer T> ? T : never

export const access = (value: unknown, key: keyof never): unknown => 
  typeof value === "object" && value !== null ? (value as never)[key] : undefined

export const buildObject = <R, K extends keyof R>(
  keys: List<K>,
  values: (key: K) => R[K]
): R =>
      keys.reduce((acc, next) => ({ ...acc, [next]: values(next) }), {}) as R

export const objectKeys = <T>(
  object: T
): List<keyof T> => Object.getOwnPropertyNames(object) as never

export const codecProduct = <A extends Record<keyof never, unknown>>(
  codecs: {
        [K in keyof A]: Codec<A[K], Json>
    }
): Codec<A, Json> => {
  
  const keys = objectKeys(codecs)
  
  return {
    encode: value => buildObject<Record<keyof A, unknown>, keyof A>(
      keys, 
      key => codecs[key].encode(value[key])
    ),
    decode: encoded => buildObject<A, keyof A>(
      keys,
      key => codecs[key].decode(access(encoded, key))
    )
  }
}

export const OptionalOf = <T>(
  model: Model<T>
): Model<T | undefined> => ({
    codec: optionalCodec(model.codec),
    check: (value): value is T | undefined => value === undefined || model.check(value) 
  })


export const EnumOf = <T, E extends T>(
  model: Model<T>,
  values: List<E>
): EnumModel<E> => ({
  codec: enumCodec(model.codec, values),
  check: (value): value is E => values.findIndex(it => it === value) >= 0,
  values: values
}) 


export const ProductOf = <A extends Record<keyof never, unknown>>(
  product: {
    [K in keyof A]: Model<A[K]>
  }
): Model<A> => {
  const keys = objectKeys(product)
  
  return {
    codec: codecProduct(
      buildObject(keys, key => product[key].codec)
    ),
    check: (value): value is A => 
      all(
        keys, 
        key => 
          typeof value === "object" && value !== null && key in value ?
            product[key].check((value as Record<keyof A, unknown>)[key]) :
            false
      )
  }
  
}

export const all = <T>(
  list: List<T>,
  predicate: (value: T) => boolean
): boolean => !list.some(value => !predicate(value))

export const ListOf = <T>(
  model: Model<T>
): Model<List<T>> => ({
    codec: listCodec(model.codec),
    check: (value): value is List<T> => Array.isArray(value) && all(value, model.check)
  })

export const StringEnumOf = <E extends string>(
  values: List<E>
): EnumModel<E> => EnumOf(StringT, values)