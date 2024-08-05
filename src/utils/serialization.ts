import { Codec } from "./codec"
import { throwError } from "./error"
import { id } from "./functional"
import { Json, ListOf, Model, Obtain, OptionalOf, ProductOf, StringEnumOf } from "./model"

const CredentialsCodec: Codec<Credentials, string> = {
  encode: (credentials) => JSON.stringify(credentials),
  decode: (encoded) => JSON.parse(encoded) as Credentials
}

export const OptionalCredentialsCodec: Codec<Credentials | undefined, string> = {
  encode: (credentials) => credentials === undefined ? '' : CredentialsCodec.encode(credentials),
  decode: (encoded) => encoded === '' ? undefined : CredentialsCodec.decode(encoded)
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

export const UserDataT = ProductOf({
  id: StringT,
  username: StringT,
  status: BooleanT
})

export const CredentialsT = ProductOf({
  accessToken: StringT,
  tokenType: StringT,
  userData: UserDataT
})

export const OperationTypeT = StringEnumOf([
  "addition", 
  "subtraction", 
  "multiplication", 
  "division", 
  "square_root",
  "random_string" 
])

export const OperationCreateT = ProductOf({
  type: OperationTypeT,
  amount1: OptionalOf(NumberT),
  amount2: OptionalOf(NumberT)
})

export const OperationResultT = ProductOf({
  result: StringT,
  cost: NumberT
})

export const BalanceT = ProductOf({
  id: NumberT,
  user_id: NumberT,
  amount: NumberT
})

export const RecordT = ProductOf({
  id: NumberT,
  amount: NumberT,
  user_balance: NumberT,
  operation_response: StringT,
  date: StringT,
  is_deleted: BooleanT,
  deleted_at: StringT
})

export const RecordsT = ListOf(RecordT)

export type UserData = Obtain<typeof UserDataT>

export type Credentials = Obtain<typeof CredentialsT>

export type OperationType = Obtain<typeof OperationTypeT>

export type OperationCreate = Obtain<typeof OperationCreateT>

export type OperationResult = Obtain<typeof OperationResultT>

export type Balance = Obtain<typeof BalanceT>

export type Record = Obtain<typeof RecordT>

export type Records = Obtain<typeof RecordsT>
