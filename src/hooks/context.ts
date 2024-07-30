import React from "react"
import { User } from "../user/User"
import { throwError } from "../utils/error"
import { VisitorUser } from "../user/VisitorUser"
import { LoggedUser } from "../user/LoggedUser"


export const UserContext = React.createContext<User | undefined>(undefined)

export const useUserContext = () => {
  return React.useContext(UserContext)
}

export const isUser = (user: User | undefined): user is User => 
  user?.type === "visitor" ||
  user?.type === "logged" 
  
const useUserType = <T extends User>(check: (user: User | undefined) => user is T): T => {
  const user = useUserContext()
  return check(user) ? user : throwError({name: "Forbidden", message: "Forbidden User type"})
}

export const useUser = () => useUserType(isUser)

export const useVisitorUser = () => 
  useUserType(
    (user): user is VisitorUser => user?.type === "visitor"
  )

export const useLoggedUser = () => 
  useUserType(
    (user): user is LoggedUser => user?.type === "logged"
  )