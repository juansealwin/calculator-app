import React, { useEffect } from "react"
import { Stack, Button, SxProps } from "@mui/material"
import DeleteIcon from "@mui/icons-material/KeyboardArrowLeft"
import { Text } from "../primitives/Text"
import { useStatefull, setTo, State } from "../utils/state"
import { LoginWindowStates } from "../components/LoginWindow"
import { useLoggedUser, useUser } from "../hooks/context"
import { OperationType } from "../utils/serialization"
import { nop, sequenceIO } from "../utils/functional"
import { useAsynchronous } from "../utils/asynchronism"

const operationButtonSx: SxProps = {
    width: "30%",
    height: "50px",
    borderRadius: "5px",
    fontSize: "1.2rem",
    backgroundColor: "#259d85",
    color: "#FFFFFF",
    "&:hover": {
        backgroundColor: "#00796B"
    }
}

const eraseButtonSx: SxProps = {
    width: "30%",
    height: "50px",
    borderRadius: "5px",
    fontSize: "1.2rem",
    backgroundColor: "#F44336",
    color: "#FFF",
    "&:hover": {
        backgroundColor: "#C62828"
    }
}

const numberButtonSx: SxProps = {
    width: "30%",
    height: "50px",
    borderRadius: "5px",
    fontSize: "1.2rem",
    backgroundColor: "#888888",
    color: "#FFFFFF",
    "&:hover": {
        backgroundColor: "#666666"
    }
}

export const operationsReg = /(\+|\-|\*|\/|√|rand)/

const checkExpression = (expr: string, operationType: OperationType | undefined): boolean => {
    if (operationType === undefined)
        return false

    const parts: string[] = expr.split(operationsReg).filter(part => part.length > 0)

    const isNumber = (str: string) => !isNaN(Number(str))

    switch (operationType) {
        case "addition":
        case "subtraction":
        case "multiplication":
            return parts.length === 3 && isNumber(parts[0]) && isNumber(parts[2]) && parts[0].length > 0 && parts[2].length > 0
        case "division":
            return parts.length === 3 && isNumber(parts[0]) && isNumber(parts[2]) && parts[0].length > 0 && parts[2].length > 0 && Number(parts[2]) !== 0
        case "square_root":
            return parts.length === 2 && parts[0] === "sqrt" && isNumber(parts[1]) && Number(parts[1]) > 0
        case "random_string":
            return parts.length === 1 && parts[0] === "random"
        default:
            return false
    }
}

export const HomePage = (
    props: {
        loginScreen: State<LoginWindowStates>
    }
) => {
    const user = useUser()
    const calcWidth = 400
    const calcHeight = calcWidth * 1.5
    const display = useStatefull(() => "")

    const operationType = useStatefull<OperationType | undefined>(() => undefined)

    const handleButtonClick = (value: string) => setTo(display, `${display.value}${value}`)

    const showResult = useStatefull(() => false) 

    return (
        <Stack width={"100%"} alignItems="center" justifyContent="center" height="100vh">
            <Stack
                width={"100%"}
                height="100vh"
                alignItems="center"
                justifyContent="center"
                spacing={3}
                sx={{ overflow: "hidden" }}
            >
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={2}
                    sx={{ position: "relative" }}
                >
                    <Stack
                        sx={{
                            width: `${calcWidth}px`,
                            height: `${calcHeight}px`,
                            backgroundColor: "#444444",
                            borderRadius: "15px",
                            border: "1px solid #111111",
                            borderBottom: "12px solid #111111",
                            borderTop: "0px solid #111111",
                            position: "relative",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.6)", 
                            transform: "perspective(600px) rotateX(6deg)",
                        }}
                    >
                        {/* Screen */}
                        <Stack
                            sx={{
                                width: "90%",
                                height: "20%",
                                backgroundColor: "#000000",
                                color: "#FFFFFF",
                                borderRadius: "10px 10px 0 0",
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "left",
                                marginBottom: "10px",
                                fontSize: "1.5rem",
                                padding: "10px",
                                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
                                position: "relative"
                            }}
                        >
                            <Text 
                                children={display.value} 
                                color={"white"} 
                                fontSize={40} 
                            />
                            {
                                showResult.value && <>
                                    <Text 
                                        children={`Res = ${display.value}`} 
                                        color={"white"} 
                                        fontSize={24} 
                                    />
                                    <Text  
                                        children={`Cost = ${display.value}`} 
                                        color={"white"} 
                                        fontSize={24} 
                                    />
                                </>
                            }
                        </Stack>

                        {/* Buttons */}
                        <Stack
                            direction="column"
                            spacing={1}
                            sx={{ width: "90%" }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}
                            >
                                {[7, 8, 9].map(num => (
                                    <Button
                                        key={num}
                                        variant="contained"
                                        sx={numberButtonSx}
                                        onClick={handleButtonClick(num.toString())}
                                        children={num}
                                    />
                                ))}
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}
                            >
                                {[4, 5, 6].map(num => (
                                    <Button
                                        key={num}
                                        variant="contained"
                                        sx={numberButtonSx}
                                        onClick={handleButtonClick(num.toString())}
                                        children={num}
                                    />
                                ))}
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}
                            >
                                {[1, 2, 3].map(num => (
                                    <Button
                                        key={num}
                                        variant="contained"
                                        sx={numberButtonSx}
                                        onClick={handleButtonClick(num.toString())}
                                        children={num}
                                    />
                                ))}
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}
                            >
                                <Button
                                    variant="contained"
                                    sx={numberButtonSx}
                                    onClick={handleButtonClick("0")}
                                    children={"0"}
                                />
                                <Button
                                    variant="contained"
                                    sx={numberButtonSx}
                                    onClick={handleButtonClick(".")}
                                    children={"."}
                                />
                                <Button
                                    variant="contained"
                                    sx={eraseButtonSx}
                                    onClick={setTo(display, display.value.slice(0, -1))}
                                >
                                    <DeleteIcon />
                                </Button>
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}
                            >
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={sequenceIO([handleButtonClick("+"), setTo(operationType, "addition")])}
                                    children={"+"}
                                />
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={sequenceIO([handleButtonClick("-"), setTo(operationType, "subtraction")])}
                                    children={"-"}
                                />
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={sequenceIO([handleButtonClick("x"), setTo(operationType, "multiplication")])}
                                    children={"x"}
                                />
                            
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap", width: "100%", justifyContent: "space-between" }}
                            >
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={sequenceIO([handleButtonClick("/"), setTo(operationType, "division")])}
                                    children={"/"}
                                />

                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={sequenceIO([handleButtonClick("√"), setTo(operationType, "square_root")])}
                                    children={"√"}
                                />
                                

                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={sequenceIO([handleButtonClick("rand"), setTo(operationType, "random_string")])}
                                    children={"Rand"}
                                />
                                
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap" }}
                                width={"100%"}
                                justifyContent={"space-between"}
                            >
                                <Button
                                    variant="contained"
                                    sx={{...eraseButtonSx, flexGrow: 1}}
                                    onClick={sequenceIO([setTo(display, ""), setTo(showResult, false), setTo(operationType, undefined)])}
                                    children={"CE"}
                                />
                                {
                                    user.type === "visitor" ? 
                                        <EqualsVistor loginScreen={props.loginScreen}/> :
                                        <EqualsLogged display={display} operationType={operationType} showResult={showResult}/>
                                }
                            </Stack>
                            
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

const EqualsVistor = (
    props: {
        loginScreen: State<LoginWindowStates>
    }
) => <Button
    variant="contained"
    sx={{...operationButtonSx, flexGrow: 1}}
    onClick={setTo(props.loginScreen, "login")}
    children={"="}
/>

const EqualsLogged = (
    props: {
        display: State<string>
        operationType: State<OperationType | undefined>
        showResult: State<boolean>
    }
) => {
    const display = props.display
    const operationType = props.operationType.value
    const loggedUser = useLoggedUser()
    const makeOperationAsync = useAsynchronous(loggedUser.actions.makeOperation)
    const runOperation = operationType !== undefined ? makeOperationAsync.run({expr: display.value, type: operationType}) : nop

    useEffect(makeOperationAsync.status === "completed" ? setTo(props.showResult, true) : nop)
    // console.log(loggedUser)
    // console.log(operationType)
    // console.log(checkExpression(display.value, operationType ?? "addition"))
    return(
        <Button
            variant="contained"
            sx={{...operationButtonSx, flexGrow: 1}}
            onClick={
                checkExpression(display.value, operationType) ?
                    runOperation :
                    setTo(display, "Syntax Error") 
            }
            children={"="}
        />
    )
}