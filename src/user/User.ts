import { sequenceIO } from "../utils/functional"
import { Credentials } from "../utils/serialization"
import { State, definedState, setTo } from "../utils/state"
import { QueryClient } from "react-query"
import { buildVisitorUser, VisitorUser } from "./VisitorUser"
import { buildLoggedUser, LoggedUser } from "./LoggedUser"

export type User = VisitorUser | LoggedUser


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
    