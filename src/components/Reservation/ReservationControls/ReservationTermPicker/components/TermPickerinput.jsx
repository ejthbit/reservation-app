import { Today } from '@mui/icons-material'
import { InputAdornment, TextField } from '@mui/material'
import { forwardRef } from 'react'

const TermPickerInput = forwardRef((props, ref) => (
    <TextField
        ref={ref}
        {...props}
        variant="standard"
        required
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <Today />
                </InputAdornment>
            ),
        }}
    />
))

TermPickerInput.displayName = 'TermPickerInput'

export default TermPickerInput
