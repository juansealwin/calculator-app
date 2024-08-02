import { Async } from "../utils/asynchronism"
import { IO } from "../utils/functional"
import { Credentials, CredentialsT } from "../utils/serialization"
import { httpUser } from "./HttpUser"


export type VisitorUser = {
    type: "visitor"
    actions: VisitorActions
}

export type VisitorActions = {
  register: (args: { username: string, password: string}) => Async<void>,
  login: (args: { username: string, password: string }) => Async<void>,
}

export const buildVisitorUser = (
  setCredentials: (credential: Credentials) => IO<void>,
): VisitorUser =>  {
  
  return {
    type: "visitor",

    actions: {
      login: (args: {username: string, password: string} ) => async () => {

        const httpVisitorUser = httpUser()
        
        const bodyLogin = {
          username: args.username, 
          password: args.password
        }

        const fetchCredentials  =  await httpVisitorUser.post(
          "/login", 
          bodyLogin,
          CredentialsT
        )()
        
        const credentials: Credentials = {
          accessToken: fetchCredentials.accessToken,
          tokenType: fetchCredentials.tokenType,
          userData: {
            id: fetchCredentials.userData.id,
            username: fetchCredentials.userData.username,
            status: fetchCredentials.userData.status
          }
        }

        setCredentials(credentials)()
      },

      register:(args: { 
        username: string, 
        password: string 
      }) => async () => {
        const httpVisitorUser = httpUser()
        
        const bodyRegister = {
          username: args.username, 
          password: args.password
        }
        
        await httpVisitorUser.post(
          "/register", 
          bodyRegister,
          CredentialsT
        )()
      }
    }
  }
}

