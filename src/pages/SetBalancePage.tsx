import React from "react"
import { Button, CircularProgress, Stack } from "@mui/material"
import { Text } from "../primitives/Text"
import { StringEditor } from "../primitives/StringEditor"
import { useStatefull } from "../utils/state"
import { useLoggedUser } from "../hooks/context"
import { useAsynchronous } from "../utils/asynchronism"
import { nop } from "../utils/functional"
import { isNumber } from "../utils/utils"
import { enumMatch } from "../utils/pattern-matching"
import { Row } from "../primitives/Stack"
import { Check } from "@mui/icons-material"

export const SetBalancePage = () => {
    
    const input = useStatefull(() => "")

    const loggedUser = useLoggedUser()

    const setBalanceAsync = useAsynchronous(loggedUser.actions.setBalance)
    
    return (
        <Stack width={"100%"} alignItems="center" height="100vh" position={"relative"}>
                
            <Text text={"Set balance"} fontSize={40} margin={4} sx={{textDecoration: "underline"}} color={"#333333"}/>

            <Row spacing={1}>

                <StringEditor
                    state={input}
                />
                
                <Button 
                    children={"SET"} 
                    onClick={isNumber(input.value) ? setBalanceAsync.run({amount: Number(input.value)}) : nop }
                    variant="contained"
                />

            </Row>
            <Stack marginTop={5}>
                {
                    enumMatch(setBalanceAsync.status)({
                        failed: <Text text={"Error, please try again"} color={"#ff3737"}/>,
                        completed: <Row spacing={1} alignItems={"center"}>
                            <Check sx={{color: "green"}}/>
                            <Text
                                text={`New balance = ${setBalanceAsync.result} $`}
                                fontSize={14}
                            />
                        </Row>,
                        running: <CircularProgress/>,
                        idle: <></>
                    })
                }
            </Stack>
          
        </Stack>
    )
}

