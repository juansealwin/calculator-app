import { operationsReg } from "../pages/Home"
import { Async } from "../utils/asynchronism"
import { IO } from "../utils/functional"
import { BalanceT, Credentials, OperationCreate, OperationResult, OperationResultT, OperationType, Records, RecordsT } from "../utils/serialization"
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
    getRecords: () => Async<Records>
    makeOperation: (args: { type: OperationType, expr: string}) => Async<OperationResult>
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

        getRecords: () => async () => {
          const httpClient = httpUser(credentials.value.accessToken)

          const records = await httpClient.get(
            "/records",
            RecordsT
          )()

          return records

        },

        makeOperation: (args: {type: OperationType, expr: string}) => async () => {

          const httpClient = httpUser(credentials.value.accessToken)

          const parts: string[] = args.expr.split(operationsReg).filter(part => part.length > 0)

          const operator1 = parts.at(0)

          const operator2 = parts.at(2)

          const operationBody: OperationCreate = {
            type: args.type,
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


    