/**
 * Input component
 * A wrapper around TextField with additional features
 */

import React, { forwardRef } from "react"
import { View, TextInput, TextInputProps } from "react-native"
import { TextField, TextFieldProps } from "../../TextField"

export interface InputProps extends Omit<TextFieldProps, "ref"> {
  /**
   * Icon component to render on the left side
   */
  leftIcon?: React.ReactNode
  /**
   * Icon component to render on the right side
   */
  rightIcon?: React.ReactNode
  /**
   * Whether to show a clear button
   */
  clearable?: boolean
  /**
   * Callback when clear button is pressed
   */
  onClear?: () => void
}

export const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    leftIcon,
    rightIcon,
    clearable = false,
    onClear,
    RightAccessory,
    LeftAccessory,
    ...rest
  } = props

  return (
    <TextField
      ref={ref}
      {...rest}
      LeftAccessory={leftIcon ? LeftAccessory : undefined}
      RightAccessory={RightAccessory}
    />
  )
})

Input.displayName = "Input"
