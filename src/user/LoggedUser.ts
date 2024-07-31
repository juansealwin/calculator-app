import { operationsReg } from "../pages/HomeV2"
import { Async } from "../utils/asynchronism"
import { IO } from "../utils/functional"
import { BalanceT, Credentials, OperationCreate, OperationResult, OperationResultT, OperationType, Records, RecordsT, StringT, VoidT } from "../utils/serialization"
import { State } from "../utils/state"
import { httpUser } from "./HttpUser"

export type LoggedUser = {
    type: "logged"
    actions: LoggedActions
    credentials: Credentials
}

export type LoggedActions = {
    logout: IO<void>,
    getBalance: () => Async<number>
    setBalance: (args: { amount: number }) => Async<number>
    getRecords: (args: { skip?: number, limit?: number }) => Async<Records>
    deleteRecord: (args: { recordId: number }) => Async<string>
    makeOperation: (args: { type: OperationType, amount1?: number, amount2?: number}) => Async<OperationResult>
    makeOperationV2: (args: { type: OperationType, expression: string}) => Async<OperationResult>
    
} 


export const buildLoggedUser = (
    credentials: State<Credentials>,
    logout: IO<void>,
  ): LoggedUser =>  {
      

    return {
      type: "logged",
  
      credentials: credentials.value,
    
      actions: {
        logout: logout,

        getBalance: () => async () => {
          const httpClient = httpUser(credentials.value.accessToken)

          const balance = await httpClient.get(
            `/balances/${credentials.value.userData.id}`,
            BalanceT
          )()

          return balance.amount

        },

        setBalance: (args: {amount: number}) => async () => {

          const httpClient = httpUser(credentials.value.accessToken)

          const newBalance = await httpClient.put(
            `/balances/${credentials.value.userData.id}`,
            { amount: args.amount },
            BalanceT
          )()

          return newBalance.amount

        },

        getRecords: (args: {skip?: number, limit?: number}) => async () => {
          const httpClient = httpUser(credentials.value.accessToken)

          const skip = args.skip ?? 0
          const limit = args.limit ?? 10

          const params = new URLSearchParams({ skip: String(skip), limit: String(limit) })

          const records = await httpClient.get(
            `/records?${params.toString()}`,
            RecordsT
          )()

          return records

        },

        deleteRecord: (args: { recordId: number }) => async () => {
          const httpClient = httpUser(credentials.value.accessToken)

          const result = await httpClient.delete(
            `/records/${args.recordId}`,
            StringT
          )()

          return result

        },

        makeOperation: (args: { type: OperationType, amount1?: number, amount2?: number}) => async () => {
          
          const httpClient = httpUser(credentials.value.accessToken)

          const operation = args.type

          const operator1 = args.amount1

          const operator2 = args.amount2

          const operationBody: OperationCreate = {
            type: operation,
            amount1: operator1,
            amount2: operator2 
          } 

          const resultOperation = await httpClient.post(
            "/operations",
            operationBody,
            OperationResultT
          )()

          return resultOperation
        },

        makeOperationV2: (args: {type: OperationType, expression: string}) => async () => {

          const httpClient = httpUser(credentials.value.accessToken)

          const operation = args.type

          const expr = args.expression.replace(/x/g, "*")

          const parts: string[] = expr.split(operationsReg).filter(part => part.length > 0)

          const operator1 = operation == "square_root" ? parts.at(1) : parts.at(0)

          const operator2 = parts.at(2)

          const operationBody: OperationCreate = {
            type: operation,
            amount1: operator1 !== undefined ? Number(operator1) : undefined,
            amount2: operator2 !== undefined ? Number(operator2) : undefined
          } 

          const resultOperation = await httpClient.post(
            "/operations",
            operationBody,
            OperationResultT
          )()

          return resultOperation
        }
      }
    }
  }


    