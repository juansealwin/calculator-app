import React from "react"
import { Navbar } from "./Navbar"
import { Box } from "@mui/material"
import { State } from "../utils/state"
import { LoginWindow, LoginWindowStates } from "./LoginWindow"
import { useUser } from "../hooks/context"

export const MainLayout = (
  props: {
    children?: React.ReactNode
    loginScreen: State<LoginWindowStates>
    reloadBalance: boolean
  }
) => {

  const user = useUser()

  return (
    <Box 
      sx={{ 
        width: "100%", 
        height: "100%",
        margin: 0,
        padding: 0,
        minHeight: '100vh', 
      }}
    >
      <Navbar loginScreen={props.loginScreen} reloadBalance={props.reloadBalance}/>
      <Box sx={{ width: "100%", height: "100%" }}>
        {props.children}
        {
          user.type === "visitor" && <LoginWindow screen={props.loginScreen}/>
        }
      </Box>
    </Box>
  )
}
