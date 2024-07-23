import React from "react"
import { Navbar } from "./Navbar"
import { Box } from "@mui/material"

export const MainLayout = (
  props: {
    children?: React.ReactNode
  }
) => {

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
      <Navbar />
      <Box sx={{ width: "100%", height: "100%" }}>
        {props.children}
      </Box>
    </Box>
  )
}
