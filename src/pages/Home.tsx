import React, { useEffect } from "react"
import { Stack, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Card, CardHeader, CardContent, Box, Divider } from "@mui/material"
import { Text } from "../components/primitives/Text"
import { useStatefull, setTo, State } from "../utils/state"
import { LoginWindowStates } from "../components/LoginWindow"
import { useLoggedUser, useUser } from "../hooks/context"
import { OperationType } from "../utils/serialization"
import { nop, sequenceIO } from "../utils/functional"
import { useAsynchronous } from "../utils/asynchronism"
import NumberEditor from "../components/primitives/NumberEditor"
import { Row } from "../components/primitives/Stack"

const OperatorTypeEditor = (
    props: {
      operationState: State<OperationType | undefined>
      handleChange: (event: SelectChangeEvent<string>) => void
    }
) => {
  
    
  
    return(
      <FormControl sx={{ width: "400px" }}>
        <InputLabel>Operation</InputLabel>
        <Select
          value={props.operationState.value ?? ""}
          label="Operation"
          onChange={props.handleChange}
        >
          <MenuItem value="">
            <em>Select Operation</em>
          </MenuItem>
          <MenuItem value={"addition"}>+</MenuItem>
          <MenuItem value={"subtraction"}>-</MenuItem>
          <MenuItem value={"multiplication"}>x</MenuItem>
          <MenuItem value={"division"}>/</MenuItem>
          <MenuItem value={"square_root"}>√</MenuItem>
          <MenuItem value={"random_string"}>Rand</MenuItem>
        </Select>
      </FormControl>
    )
}

const OperationEditor = (
    props: {
        operationType: State<OperationType | undefined>
        operator1: State<number | undefined>
        operator2: State<number | undefined>
    }
) => {

    const operationType = props.operationType 
    const operator1 = props.operator1 
    const operator2 = props.operator2

    const handleChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value
        if (value === "") {
            setTo(operationType, undefined)()
        } else {
            const newValue =  value as OperationType
            if (newValue === "square_root") {
                setTo(operator2, undefined)()
            }

            if (newValue === "random_string") {
                setTo(operator1, undefined)()
                setTo(operator2, undefined)()
            }

            setTo(operationType, newValue)()
        }
      }

    return(
        <>
            <OperatorTypeEditor operationState={operationType} handleChange={handleChange}/>

            <NumberEditor 
                sx={{ width: "400px" }} 
                label="Operator 1" 
                state={operator1}
                disable={operationType.value === "random_string"}
            />

            <NumberEditor 
                sx={{ width: "400px" }} 
                label="Operator 2" 
                state={operator2}
                disable={operationType.value === "square_root" || operationType.value === "random_string"}
            />
        </>
    )
}


export const HomePage = (
    props: {
        loginScreen: State<LoginWindowStates>
        reloadBalance: State<boolean>
    }
) => {
    const user = useUser()

    return (
        <Stack width={"100%"} alignItems="center" justifyContent="center" height="100vh">
            <Stack
                width={"100%"}
                height="100vh"
                alignItems="center"
                marginTop={10}
                spacing={3}
                sx={{ overflow: "hidden" }}
            >
                <Text text={"New Operation"} fontSize={40} margin={4} sx={{textDecoration: "underline"}} color={"#333333"}/>
                
                {
                    user.type === "visitor" ? 
                        <VisitorHome loginScreen={props.loginScreen}/> : 
                        <LoggedHome reloadBalance={props.reloadBalance}/>
                }
            </Stack>
        </Stack>
    )
}

const VisitorHome = (
    props: {
        loginScreen: State<LoginWindowStates>
    }
) => {

    const operationType = useStatefull<OperationType | undefined>(() => undefined)
    const operator1 = useStatefull<number | undefined>(() => undefined)
    const operator2 = useStatefull<number | undefined>(() => undefined)
    

    return(
        <>
            <OperationEditor
                operationType={operationType}
                operator1={operator1}
                operator2={operator2}
            />

            <Row spacing={3}>
                <Button 
                    variant="contained" 
                    children={<Text text={"Calculate!"} 
                    onClick={setTo(props.loginScreen, "login")}/>}
                    sx={{ background: "#259d85", width: "100%", height: "50px", "&:hover": { backgroundColor: "#00796B" } }}
                    //sx={{ width: "100%" }}
                />
            </Row>
        </>
    )
}

const LoggedHome = (
    props: {
        reloadBalance: State<boolean>
    }
) => {

    const user = useLoggedUser()
    const operationType = useStatefull<OperationType | undefined>(() => undefined)
    const operator1 = useStatefull<number | undefined>(() => undefined)
    const operator2 = useStatefull<number | undefined>(() => undefined)
    const result = useStatefull(() => "")
    const cost = useStatefull(() => "")
    const showError = useStatefull(() => false)
    const showResult = useStatefull(() => false)

    const makeOperationAsync = useAsynchronous(user.actions.makeOperation)

    const checkOperation = (operationType: OperationType, operator1?: number, operator2?: number) => {
        
        switch (operationType) {
            case "addition":
            case "subtraction":
            case "multiplication":
                return operator1 !== undefined && operator2 !== undefined
            case "division":
                return operator1 !== undefined && operator2 !== undefined && operator2 !== 0
            case "square_root":
                return operator1 !== undefined && operator1 > 0
            case "random_string":
                return true
            default:
                return false
        }
    }

    useEffect(
        makeOperationAsync.result !== undefined && makeOperationAsync.status === "completed" ?
            sequenceIO([
                setTo(result, makeOperationAsync.result?.result ?? ""), 
                setTo(cost, `${makeOperationAsync.result?.cost}`),
                props.reloadBalance.apply(it => !it)
            ]) :
            nop,
        [makeOperationAsync.status, makeOperationAsync.result]
    )
    console.log(makeOperationAsync.error)

    return(
        <>

            <OperationEditor
                operationType={operationType}
                operator1={operator1}
                operator2={operator2}
            />

            <Row spacing={3}>
                <Button 
                    variant="contained" 
                    children={<Text text={"New operation"}/>} 
                    onClick={
                        sequenceIO([ 
                            setTo(operationType, undefined),
                            setTo(operator1, undefined),
                            setTo(operator2, undefined),
                            setTo(result, ""), 
                            setTo(cost, ""),
                            setTo(showError, false), 
                            setTo(showResult, false) 
                        ])
                    }
                    sx={{ background: "#259d85", width: "100%", "&:hover": { backgroundColor: "#00796B" } }}
                />
                <Button 
                    variant="contained" 
                    children={<Text text={"Calculate!"}/>} 
                    onClick={
                        operationType.value !== undefined && checkOperation(operationType.value, operator1.value, operator2.value) ?
                            sequenceIO([
                                makeOperationAsync.run({
                                    type: operationType.value, 
                                    amount1: operator1.value, 
                                    amount2: operator2.value
                                }),
                                setTo(showError, false),
                                setTo(showResult, true)
                            ]) :
                            sequenceIO([setTo(showError, true), setTo(showResult, false)])
                    }
                    sx={{ width: "100%" }}
                />
            </Row>
            { showError.value && <Text text={"Syntax Error!"} fontSize={24} color={"#f44336"}/> }
            { makeOperationAsync.error?.message === "Status code 402" && <Text text={"Insuficient Balance"} fontSize={24} color={"#f44336"}/> }
            {
                showResult.value &&  result.value.length > 0 && cost.value.length > 0 && <ResultCard result={result} cost={cost}/>
            }
        </>
    )
}

const ResultCard = (
    props: {
        result: State<string>
        cost: State<string>
    }
) => {
    return (
        <Card sx={{ width: 400, margin: 'auto', mt: 4, boxShadow: 3 }}>
            <CardHeader
                title="Operation Result"
                sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}
            />
            <CardContent>
                <Box textAlign="center">
                    <Text variant="h6" component="div" gutterBottom>
                        Result
                    </Text>
                    <Text variant="body1" component="div">
                        {props.result.value !== undefined ? props.result.value : 'N/A'}
                    </Text>
                    <Divider sx={{ my: 2 }} />
                    <Text variant="h6" component="div" gutterBottom>
                        Cost
                    </Text>
                    <Text variant="body1" component="div">
                        {props.cost.value !== undefined ? props.cost.value : 'N/A'}
                    </Text>
                </Box>
            </CardContent>
        </Card>
    )
}