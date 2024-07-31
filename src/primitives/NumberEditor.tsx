import React from 'react'
import TextField from '@mui/material/TextField'
import { setTo, State } from '../utils/state'
import { SxProps } from '@mui/material'

const NumberEditor = (
    props: { 
        state: State<number | undefined> 
        sx?: SxProps
        label?: string
    }
) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (value === '') {
      setTo(props.state, undefined)()
    } else {
      const parsedValue = parseFloat(value)
      if (!isNaN(parsedValue)) {
        setTo(props.state, parsedValue)()
      }
    }
  }

  return (
    <TextField
      fullWidth
      label={props.label}
      type="number"
      value={props.state.value !== undefined ? props.state.value : ''}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      sx={props.sx}
      inputProps={{
        min: -Infinity
      }}
    />
  )
}

export default NumberEditor
