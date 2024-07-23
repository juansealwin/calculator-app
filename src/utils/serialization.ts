import { Codec } from "./codec"
import { throwError } from "./error"
import { id } from "./functional"
import { Json, ListOf, Model, Obtain, ProductOf } from "./model"

export const VoidT: Model<void> = {
  codec: {
    encode: () => undefined,
    decode: () => undefined
  },
  check: (value): value is void => true
}
  
export const stringCodec: Codec<string, Json> = {
  encode: id,
  decode: value => StringT.check(value) ? value : throwError({name: `${value}`, message: `${value} is not a string`} )
}

export const numberCodec: Codec<number, Json> = {
  encode: id,
  decode: value => NumberT.check(value) ? value : throwError({name: `${value}`, message: `${value} is not a number`} )
}

export const booleanCodec: Codec<boolean, Json> = {
  encode: id,
  decode: value => BooleanT.check(value) ? value : throwError({name: `${value}`, message:`${value} is not a boolean`})
}

export const BooleanT: Model<boolean> = {
  codec: booleanCodec,
  check: (value): value is boolean => typeof value === "boolean"
}

export const StringT: Model<string> = {
  codec: stringCodec,
  check: (value): value is string => typeof value === "string"
}

export const NumberT: Model<number> = {
  codec: numberCodec,
  check: (value): value is number => typeof value === "number"
}


export const jsonToStringCodec: Codec<Json, string> = {
  encode: value => JSON.stringify(value),
  decode: encoded => JSON.parse(encoded)
}

export const UserDataT = ProductOf({
  id: StringT,
  email: StringT,
  status: BooleanT
})

export const CredentialsT = ProductOf({
  token: StringT,
  userData: UserDataT,
})

export const UsersDataT = ListOf(UserDataT)

export type UserData = Obtain<typeof UserDataT>

export type UsersData = Obtain<typeof UsersDataT>

export type Credentials = Obtain<typeof CredentialsT>

