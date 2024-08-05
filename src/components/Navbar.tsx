import React, { useEffect } from "react"
import { Text } from "./primitives/Text"
import { Box, Button } from "@mui/material"
import { Col, Row } from "./primitives/Stack"
import { useNavigation } from "../hooks/navigation"
import { useLoggedUser, useUser } from "../hooks/context"
import LogoutIcon from "@mui/icons-material/Logout"
import { LoginWindowStates } from "./LoginWindow"
import { setTo, State, useStatefull } from "../utils/state"
import { useAsynchronous } from "../utils/asynchronism"
import { nop } from "../utils/functional"

export const Navbar = (
  props: {
    loginScreen: State<LoginWindowStates>
    reloadBalance: boolean
  }
) => {

  const user = useUser()
  const nav = useNavigation()

  return(
    <Row 
      sx={{ 
        backgroundColor: "#282C34", 
        height: 50, 
        alignContent: "center",
        justifyContent: "space-around",
        alignItems: "center"
      }} 
      padding={5}
    >
      <Row
        sx={{
          cursor: "pointer", 
          alignContent: "center", 
          alignItems: "center" 
        }} 
        spacing={2}
      >
        <Text
          color={"white"}
          text={"Calculator App"}
          fontSize={40}
          left={"5%"}
        />
      </Row>
      <Row/>
        
          {
            user.type === "visitor" ?
              <Row 
                justifyContent={"space-around"} 
                alignItems={"center"}
                spacing={10}
              >
                <Button 
                  children={<Text text="Login" fontSize={16}/>}
                  sx={{color:"white"}}
                  onClick={setTo(props.loginScreen, "login")}
                />
                <Button 
                  children={<Text text="Sign up" fontSize={16}/>}
                  sx={{color:"white"}}
                  onClick={setTo(props.loginScreen, "register")}
                />
              </Row> :
              <LoggedNavbar reloadBalance={props.reloadBalance}/>
          } 
    </Row>
  )
}


const LoggedNavbar = (
  props: {
    reloadBalance: boolean
  }
) => {

  const user = useLoggedUser()
  const nav = useNavigation()
  const getBalanceAsync = useAsynchronous(
    user.actions.getBalance, 
    [user.credentials.userData.id, user.credentials.accessToken, props.reloadBalance]
  )
  const balance = useStatefull<number | undefined>(() => undefined)
  useEffect(getBalanceAsync.run({}), [user.credentials.userData.id, user.credentials.accessToken, props.reloadBalance])

  useEffect(getBalanceAsync.result !== undefined && getBalanceAsync.status === "completed" ? 
    setTo(balance, getBalanceAsync.result) : nop, 
    [user.credentials.userData.id, user.credentials.accessToken, props.reloadBalance]
  )

  return(
    <Row 
      justifyContent={"space-around"} 
      alignItems={"center"}
      spacing={10}
      height={"100%"}
    >
      <Button 
        children={<Text text="New operation" fontSize={16}/>}
        sx={{color:"white"}}
        onClick={nav.goTo.newOperation}
      />
      <Button 
        children={<Text text="History Records" fontSize={16}/>}
        sx={{color:"white"}}
        onClick={nav.goTo.operationHistory}
      />

      <Box sx={{width: "1px", height: "100%", border: "1px solid white", background: "white"}}/>

      <Row spacing={2} alignItems={"center"}>
        <Col spacing={0.5} alignItems={"center"}>
          <Text 
            text={`Hi ${user.credentials.userData.username}`}  
            fontSize={18}
            color={"white"}
          />
          
          {
            <>
              <Text 
                text={`Balance: ${ balance.value ?? getBalanceAsync.result ?? ""} $`}  
                fontSize={18}
                color={"white"}
                sx={{ background: "#259d85", padding: 1, borderRadius: "5px" }}
              />
            </>
          }
        </Col>
      </Row>

      <LogoutIcon 
        sx={{color:"white", fontSize: 36, cursor: "pointer"}}
        onClick={user.actions.logout}
      />
    </Row> 
  )
}