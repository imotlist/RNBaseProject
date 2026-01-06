/**
 * Textarea component
 * A multi-line text input component
 */

import React, { forwardRef } from "react"
import { TextInput } from "react-native"
import { TextField, TextFieldProps } from "../../TextField"
import { scale, scaleFontSize } from "@/utils/responsive"

export interface TextareaProps extends Omit<TextFieldProps, "ref" | "multiline"> {
  /**
   * Number of rows to show
   */
  rows?: number
  /**
   * Maximum height of the textarea
   */
  maxHeight?: number
  /**
   * Whether to auto-expand
   */
  expandable?: boolean
}

export const Textarea = forwardRef<TextInput, TextareaProps>((props, ref) => {
  const {
    rows = 4,
    maxHeight,
    expandable = false,
    style,
    size,
    rounded,
    ...rest
  } = props

  const lineHeight = scaleFontSize(24)
  const verticalPadding = scale(12)
  const minHeight = rows * lineHeight + verticalPadding * 2

  return (
    <TextField
      ref={ref}
      multiline
      numberOfLines={rows}
      size={size}
      rounded={rounded}
      inputWrapperStyle={{ paddingVertical: verticalPadding }}
      style={[
        style,
        {
          minHeight,
          maxHeight: maxHeight || undefined,
          textAlignVertical: "top",
        },
      ]}
      {...rest}
    />
  )
})

Textarea.displayName = "Textarea"
