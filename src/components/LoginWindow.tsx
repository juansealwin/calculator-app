import React from "react"
import { applyLens, lens, setTo, State, useStatefull } from "../utils/state"
import { Button, CircularProgress, Dialog } from "@mui/material"
import { IO, nop } from "../utils/functional"
import { Check, Close, Lock, Person } from "@mui/icons-material"
import { Col, Row } from "../primitives/Stack"
import { enumMatch, matchEnumLazy } from "../utils/pattern-matching"
import { useVisitorUser } from "../hooks/context"
import { useAsynchronous } from "../utils/asynchronism"
import { Text } from "../primitives/Text"
import { StringEditor } from "../primitives/StringEditor"


export type LoginWindowStates = "register" | "login" | "hidden"

const animatedEntrance = {
    animation: "easeUp .3s ease-in-out forwards",
    "@keyframes easeUp": {
      "0%": {
        opacity: 0,
        transform: "translateY(20px)"
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0)"
      }
    }
  } 

export const LoginWindow = (
  props: {
    screen: State<LoginWindowStates>
  }
) => {

  return(
    <Dialog
      open={props.screen.value !== "hidden"}
      onClose={setTo(props.screen, "hidden")}
      PaperProps={{
        sx: {
          margin: "16px",
          maxHeight: "calc(100% - 16px)",
          borderRadius: "10px"
        }
      }}
    >
      <ContentLoginWindow 
        screen={props.screen}  
        onClose={setTo(props.screen, "hidden")}  
      />
    </Dialog>

  )
}

export const ContentLoginWindow = (
  props: {
    screen: State<LoginWindowStates>
    onClose?: IO<void>
  }
) => {

  return <Col 
    sx={{
      background: "lightgray",
    }}
    width={600}
    boxSizing={"border-box"}
    padding={2}
    justifyContent={"center"}
    alignItems={"center"}     
  >
    { matchEnumLazy(props.screen.value)({
        login: () => 
          <LoginForm 
            screen={props.screen}
          />,
        register: () => 
          <RegisterForm 
            screen={props.screen}
          />,
        hidden: () => <></>
    })
    }
     <Close onClick={props.onClose} sx={{ position: "absolute", top: 5, right: 5, cursor: "pointer" }}/>
  </Col>
}


export const LoginForm = (
    props: {
      screen: State<LoginWindowStates>
    }
  ) => {
  
    const credentials = useStatefull(
        () => ({
          username: "",
          password: ""
        })
      )
    
    const showpassword  = useStatefull<boolean>(() => false)
    const visitorUser = useVisitorUser()
    const login = useAsynchronous(visitorUser.actions.login)
    const runLogin = login.run({username: credentials.value.username, password: credentials.value.password})
  
    return ( 
        <Col
          width={"80%"}
          padding={4}
          height={"max-content"}
          sx={{ alignItems: "center", ...animatedEntrance }}
          spacing={3}
        >
  
          <Text text={"Login"} fontSize={25} />
          <Row
            justifyContent={"space-around"}
            width={"100%"}
          >
            <Col width={"100%"} spacing={3}>
                <StringEditor 
                    style={{ width: "100%"}}
                    prefix={<Person style={{ margin: 4, color: "#666666" } } />}
                    label={"Email"}
                    key={"Email"}
                    placeholder={"Enter Email"}
                    type="email"
                    state={applyLens(credentials, lens("username"))}
                    onKeyPressed={key => key === "Enter" ? runLogin : nop }
                />
                <StringEditor 
                    style={{ width: "100%" }}
                    prefix={<Lock style={{ margin: 4, color: "#666666"} } />}
                    label={"Password"}
                    key={"Password"}
                    placeholder={"Enter Password"}
                    type="password"
                    showErrors={false}
                    state={applyLens(credentials, lens("password"))}
                    onKeyPressed={key => key === "Enter" ? runLogin : nop }
                    showpassword ={showpassword }
                /> 
            </Col>

            
          </Row>
  
          {
            enumMatch(login.status)({
                failed: <Text text={"Wrong username or password"} color={"#ff3737"}/>,
                completed: <></>,
                running: <CircularProgress/>,
                idle: <></>
            })
          }

          <Row spacing={5}> 
            <Button
                onClick={setTo(props.screen, "hidden")}
                variant={"outlined"}
                children={"Back"}
            />   
            <Button
                onClick={runLogin}
                variant={"contained"}
                children={"Login"}
            />
          </Row>
          <Row alignSelf={"center"} spacing={1}>
            <Text text="Don't have an account?" fontSize={12} color={"#666666"}/> 
            <Text 
                text="Sign up" 
                fontSize={12} 
                color={"#1976d2"} 
                sx={{ textDecoration: "underline", cursor: "pointer" }} 
                onClick={setTo(props.screen, "register")}
            />
          </Row>
        </Col>
    )
  }

export const RegisterForm = (
    props: {
      screen: State<LoginWindowStates>
    }
  ) => {
  
    const data = useStatefull(
      () => ({
        username: "",
        password: ""
      })
    )
  
    const repeatPassword = useStatefull(() => "")
    const showpassword  = useStatefull<boolean>(() => false)
    const visitorUser = useVisitorUser()
    const registry = useAsynchronous(visitorUser.actions.register)
  
    const runRegistry = registry.run({ 
      username: data.value.username, 
      password: data.value.password
    })

    const hasNumber = /\d/
    const hasLetter = /[a-zA-Z]/
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const validRegistry = 
        data.value.username.length > 5 && 
        emailRegex.test(data.value.username) &&
        data.value.password.length > 5 &&
        hasNumber.test(data.value.password) &&
        hasLetter.test(data.value.password) &&
        data.value.password === repeatPassword.value    
  
  
    return (
     
        <Col
          width={"80%"}
          padding={4}
          height={"max-content"}
          sx={{ alignItems: "center", ...animatedEntrance }}
          spacing={3}
        >
  
          <Text text={"Sign Up"} fontSize={25} />
          <Row
            justifyContent={"space-around"}
            width={"100%"}
          >
            <Col width={"100%"} spacing={1}>
                <Col spacing={3}>
                    <StringEditor 
                        style={{ width: "100%"}}
                        prefix={<Person style={{ margin: 4, color: "#666666" } } />}
                        label={"Email"}
                        key={"Email"}
                        placeholder={"Email"}
                        type="email"
                        state={applyLens(data, lens("username"))}
                        onKeyPressed={key => key === "Enter" ? runRegistry : nop }
                    />
                    <StringEditor 
                        style={{ width: "100%" }}
                        prefix={<Person style={{ margin: 4, color: "#666666" } } />}
                        label={"Password"}
                        key={"Password"}
                        placeholder={"Enter Password"}
                        type="password"
                        state={applyLens(data, lens("password"))}
                        onKeyPressed={key => key === "Enter" ? runRegistry : nop }
                        showpassword ={showpassword}
                    />
                    <StringEditor 
                        style={{ width: "100%"}}
                        prefix={<Person style={{ margin: 4, color: "#666666" } } />}
                        label={"Repeat Password"}
                        key={"Repeat Password"}
                        placeholder={"Repeat Password"}
                        type="password"
                        state={repeatPassword}
                        onKeyPressed={key => key === "Enter" ? runRegistry : nop }
                        showpassword ={showpassword}
                    />

                </Col>

                <Text text="Password Requirements: 6 characters long, contain at least one letter, contain at least one number" fontSize={12} color={"#666666"}/> 
                
            </Col>
          </Row>
  
  
          {
            enumMatch(registry.status)({
                failed: <Text text={"Error, please try again"} color={"#ff3737"}/>,
                completed: <Row spacing={1} alignItems={"center"}>
                    <Check sx={{color: "green"}}/>
                    <Text
                        text={"Sign up has been successfully completed"}
                        fontSize={14}
                    />
                </Row>,
                running: <CircularProgress/>,
                idle: <></>
            })
          }

          <Row spacing={5}> 
            
            <Button
                sx={{marginTop: 3}}
                onClick={setTo(props.screen, "login")}
                variant={"outlined"}
                children={"Back"}
            />   
            <Button
                sx={{marginTop: 3}}
                disabled={!validRegistry}
                onClick={runRegistry}
                children={"Sign up"}
                variant={"contained"}
            />
          </Row>
          <Row alignSelf={"center"} spacing={1}>
            <Text text="Have an account?" fontSize={12} color={"#666666"}/> 
            <Text 
                text="Login" 
                fontSize={12} 
                color={"#1976d2"} 
                sx={{ textDecoration: "underline", cursor: "pointer" }} 
                onClick={setTo(props.screen, "login")}
            />
          </Row>
        </Col>
    )
  }