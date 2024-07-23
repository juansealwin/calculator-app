import { Typography, TypographyProps } from "@mui/material"
import React from "react"



export const Text = (
  props: TypographyProps & {
    text?: string
    children?: React.ReactNode
    prefix?: boolean
  }
) => <Typography
 {...props}
>
  {props.prefix === true ? props.children : props.text}
  {props.prefix === true? props.text : props.children}
</Typography>

export type AlignText = "inherit" | "left" | "center" | "right" | "justify" | undefined 