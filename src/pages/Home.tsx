import React from "react"
import { Stack, Button, Typography, SxProps } from "@mui/material"
import DeleteIcon from "@mui/icons-material/KeyboardArrowLeft"
import { Text } from "../primitives/Text"
import { useStatefull, setTo } from "../utils/state"

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

const evaluateExpression = (expr: string) => {
    try {
        const sanitizedExpr = expr
            .replace(/[^0-9+\-*/().x]/g, '') 
            .replace(/x/g, '*') 
            .replace(/(\d+)([*/])(\d+)/g, '$1$2$3') 

        const result = new Function('return ' + sanitizedExpr)()
        if (result === undefined || isNaN(result)) {
            return 'Syntax Error'
        }
        return result.toString()
    } catch (error) {
        return 'Syntax Error'
    }
}

export const HomePage = () => {
    const calcWidth = 400
    const calcHeight = calcWidth * 1.5
    const display = useStatefull(() => "")

    const handleButtonClick = (value: string) => setTo(display, `${display.value}${value}`)


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
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "10px",
                                fontSize: "1.5rem",
                                padding: "10px",
                                boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.5)",
                            }}
                        >
                            <Text children={display.value} color={"white"} fontSize={48} />
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
                                    >
                                        {num}
                                    </Button>
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
                                    >
                                        {num}
                                    </Button>
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
                                    >
                                        {num}
                                    </Button>
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
                                >
                                    0
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={numberButtonSx}
                                    onClick={handleButtonClick(".")}
                                >
                                    .
                                </Button>
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
                                    onClick={handleButtonClick("+")}
                                >
                                    +
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={handleButtonClick("-")}
                                >
                                    -
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={handleButtonClick("x")}
                                >
                                    x
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
                                    onClick={handleButtonClick("/")}
                                >
                                    /
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={operationButtonSx}
                                    onClick={setTo(display, Math.random().toString(36).substring(2, 15))}
                                >
                                    Rand
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={eraseButtonSx}
                                    onClick={ setTo(display, "")}
                                    children={"CE"}
                                />
                            </Stack>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{ flexWrap: "wrap" }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{...operationButtonSx, width: "100%"}}
                                    onClick={setTo(display, evaluateExpression(display.value))}
                                    children={"="}
                                />
                            </Stack>
                            
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
