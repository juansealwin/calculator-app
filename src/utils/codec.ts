import { throwError } from "./error"
import { List } from "./list"
import { Json } from "./model"
import { letIn } from "./pattern-matching"

export type Codec<T, E> = {
  encode: (value: T) => E
  decode: (encoded: E) => T
}   

export const optionalCodec = <T>(
  codec: Codec<T, Json>
): Codec<T | undefined, Json> => ({
    encode: value => value === undefined || value === null ? null : codec.encode(value),
    decode: encoded => encoded === null || encoded === undefined ? undefined : codec.decode(encoded)
  })

export const enumCodec = <A, B extends A, E>(
  codec: Codec<A, E>,
  values: List<B>
): Codec<B, E> => refinedCodec(
  codec, 
  value => values.findIndex(it => it === value) >= 0
) as unknown as Codec<B, E>

export const refinedCodec = <T, E>(
  codec: Codec<T, E>,
  predicate: (value: T) => boolean
): Codec<T, E> => ({
    encode: value => predicate(value) ? codec.encode(value) : 
      throwError({name:"Refined codec error", message: `invalid refined value ${value}`}),
    decode: encoded => letIn(codec.decode(encoded), decoded =>
      predicate(decoded) ? decoded : throwError({name:"Refined codec error", message: `invalid decoded value ${decoded}`}),
    )
  })

export const listCodec = <T>(
  codec: Codec<T, Json>
): Codec<List<T>, Json> => ({
    encode: value => value.map(codec.encode),
    decode: encoded => {
      if (!Array.isArray(encoded)) return throwError({name: `Codec error ${encoded}`, message: "not an array"})
        return encoded.map(codec.decode)
    }
  })
