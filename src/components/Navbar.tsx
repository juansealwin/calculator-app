import React from "react"
import { Text } from "../primitives/Text"
import { Avatar, Button } from "@mui/material"
import { Col, Row } from "../primitives/Stack"
import { useNavigation } from "../hooks/navigation"
import { useUser } from "../hooks/context"
import LogoutIcon from "@mui/icons-material/Logout"

export const Navbar = () => {

  const nav = useNavigation()
  const user = useUser()

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
          width: "18%", 
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
        />
      </Row>
      <Row
        sx={{flexGrow: 1}}
        
        justifyContent={"space-around"}
      />

       
      
        <Col
          sx={{
            borderLeft: "1px solid white",
            padding: 8
          }}
          spacing={1}
        >
          {
            user.type !== "visitor" ?
            <>
              <Button 
                children={<Text text="Iniciar sesión" fontSize={16}/>}
                sx={{color:"white"}}
              />
            </> :
            <Row 
              justifyContent={"space-around"} 
              alignItems={"center"}
              spacing={10}
            >
              <Button 
                children={<Text text="New operation" fontSize={16}/>}
                sx={{color:"white"}}
              />
              <Button 
                children={<Text text="History Records" fontSize={16}/>}
                sx={{color:"white"}}
              />
              <LogoutIcon 
                sx={{color:"white", fontSize: 36}}
              />
            </Row> 
          } 
        </Col>
      
       
    </Row>
  )
}
