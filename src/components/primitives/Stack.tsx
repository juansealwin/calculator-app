import { Stack } from "@mui/material"
import React from "react"

export type StackProps = React.ComponentProps<typeof Stack>

export const Col = (
  props: StackProps
) => <Stack
  direction={"column"}
  {...props}
/>


export const Row = (
  props: StackProps
) => <Stack
  direction={"row"}
  {...props}
/>
