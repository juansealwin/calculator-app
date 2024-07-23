import { Async, asyncNoOp } from "../utils/asynchronism"
import { IO, sequenceIO } from "../utils/functional"
import { Credentials } from "../utils/serialization"
import { State, definedState, setTo } from "../utils/state"
import { QueryClient } from "react-query"

export type User = VisitorUser | LoggedUser

export type VisitorUser = {
    type: "visitor"
    actions: VisitorActions
}

export type LoggedUser = {
    type: "logged"
    actions: LoggedActions
    credentials: Credentials
}

export type VisitorActions = {
    login: (args: { username: string, password: string }) => Async<void>,
}

export type LoggedActions = {
    logout: IO<void>,
}

export const buildLoggedUser = (
    credentials: State<Credentials>,
    logout: IO<void>,
  ): LoggedUser =>  {
      
    return {
      type: "logged",
  
      credentials: credentials.value,
    
      actions: {
        logout: logout
      }
    }
  }


export const buildVisitorUser = (
    setCredentials: (credential: Credentials) => IO<void>,
  ): VisitorUser =>  {
    
    return {
      type: "visitor",
  
      actions: {
        login: (args: {username: string, password: string} ) => asyncNoOp
  
      }
    }
  }

export const buildUser = (
    credentials: State<Credentials | undefined>,
    queryClient: QueryClient
  ): User => {
    
    const credentialsState = definedState(credentials)
  
    const logout = sequenceIO([
      () => queryClient.removeQueries(),
      setTo(credentials, undefined)
    ])
  
    return (
      credentialsState === undefined ? 
        buildVisitorUser(newCredentials => setTo(credentials, newCredentials)) :
        buildLoggedUser(credentialsState, logout) 
        
    )
  }
    