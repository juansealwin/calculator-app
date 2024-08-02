import React from "react"
import { IconButton, TextField, TextFieldProps } from "@mui/material"
import { List } from "../utils/list"
import { IO } from "../utils/functional"
import { State, setTo } from "../utils/state"
import { Visibility, VisibilityOff } from "@mui/icons-material"

export const StringEditor = (
  props: {
    state?: State<string>
    value?: string
    label?: string
    type?: "normal" | "email" | "password"
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    showErrors?: boolean
    showpassword ?: State<boolean>
    valid?: boolean
    placeholder?: string
    style?: React.CSSProperties
    errorList?: List<string>
    onKeyPressed?: (key: string) => IO<void>
    className?: string
    rows?: number
    disable?: boolean
    readOnly?: boolean
  }
) =>  {
  const error = ((props.valid === false) || props.showErrors) ?? false

  return (
    <Input
      style={props.style}
      variant="outlined"
      state={props.state}
      value={props.value}
      type={props.type}
      placeholder={props.placeholder}
      label={props.label}
      error={error}
      helperText={
        error ? props.errorList?.join(", ") : undefined
      }
      className={props.className}
      rows={props.rows}
      disable={props.disable}
      readOnly={props.readOnly}
      showpassword ={props.showpassword }
      prefixx={props.prefix}
      suffix={props.suffix}
    />
  )
}


export const Input = (
  props: TextFieldProps & {
    value?: string
    state?: State<string>
    rows?: number
    disable?: boolean
    readOnly?: boolean
    showpassword ?: State<boolean>
    prefixx?: React.ReactNode
    suffix?: React.ReactNode
  }
) =>
  <TextField
    multiline={props.rows === undefined ? false : true}
    rows={props.rows}
    value={props.state !== undefined ? props.state?.value : props.value}
    onChange={event => props.state !== undefined ? setTo(props.state, event.target.value)() : undefined}
    disabled={props.disable}
    InputProps={{
      readOnly: props.readOnly,
      startAdornment: props.prefixx,
      endAdornment: props.type === "password" && props.showpassword  !== undefined?
        <IconButton
          aria-label="toggle password visibility"
          onClick={setTo(props.showpassword, !props.showpassword?.value)}
          onMouseDown={(event) => event.preventDefault()}
          edge="end"
        >
          {props.showpassword.value ? <Visibility /> : <VisibilityOff />}
        </IconButton> : props.suffix
    }}
    {...props}
    type={
      props.showpassword === undefined ? 
        "text" : 
        props.showpassword.value ? "text" : "password"
    }
  />
