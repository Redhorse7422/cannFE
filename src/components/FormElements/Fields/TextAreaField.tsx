'use client'

import type { ControllerProps } from '../Controller'
import type { TextAreaProps as TextAreaInputProps } from '../InputGroup/text-area'

import React from 'react'

import { Controller } from '../Controller'
import { TextArea } from '../InputGroup/text-area'

type TextAreaFieldProps = Omit<TextAreaInputProps, 'name'> &
  Required<Pick<TextAreaInputProps, 'name'>> &
  Pick<ControllerProps, 'control' | 'rules'>

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={TextArea} inputProps={{ ...props }} />
}
