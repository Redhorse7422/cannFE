'use client'

import type { IconAllowed } from '@/components/common/icon'

import React from 'react'

import clsx from 'clsx'

import { Icon } from '@/components/common/icon'

import { InputWrapper, type InputWrapperProps } from '../InputWrapper'

export type TextAreaProps = Pick<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | 'placeholder'
  | 'name'
  | 'id'
  | 'required'
  | 'value'
  | 'defaultValue'
  | 'disabled'
  | 'maxLength'
  | 'readOnly'
  | 'onBlur'
  | 'onKeyDown'
  | 'style'
  | 'rows'
> &
  Pick<
    InputWrapperProps,
    | 'errorMsg'
    | 'isError'
    | 'freezeErrorSpace'
    | 'labelAxis'
    | 'width'
    | 'classNames'
    | 'size'
    | 'labelWidth'
    | 'disabledErrorMsg'
    | 'helperText'
  > & {
    refInput?: React.RefObject<HTMLTextAreaElement>
    label?: string
    prefixIcon?: IconAllowed
    suffixIcon?: IconAllowed
    onChange?: (value?: string) => void
    className?: string
  }

export const TextArea: React.FC<TextAreaProps> = (props) => {
  const {
    refInput,
    label,
    required,
    isError,
    errorMsg,
    disabledErrorMsg,
    freezeErrorSpace,
    className,
    labelAxis,
    width,
    classNames,
    labelWidth,
    size = 'middle',
    helperText,
    prefixIcon,
    suffixIcon,
    onChange,
    onBlur,
    ...textareaProps
  } = props

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value)
  }

  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    middle: 'text-base px-3 py-2',
    large: 'text-lg px-4 py-3',
  }

  return (
    <InputWrapper
      label={label}
      required={required}
      isError={isError}
      errorMsg={errorMsg}
      freezeErrorSpace={freezeErrorSpace}
      className={className}
      classNames={classNames}
      labelAxis={labelAxis}
      width={width}
      size={size}
      labelWidth={labelWidth}
      disabledErrorMsg={disabledErrorMsg}
      helperText={helperText}
    >
      <div className='relative w-full'>
        {prefixIcon && (
          <span className='pointer-events-none absolute left-3 top-3 text-gray-400'>
            <Icon name={prefixIcon} />
          </span>
        )}

        <textarea
          ref={refInput}
          className={clsx(
            'w-full resize-none rounded-md border border-gray-300 outline-none focus:border-primary focus:ring-2 focus:ring-primary',
            sizeClasses[size],
            prefixIcon && 'pl-10',
            suffixIcon && 'pr-10',
            classNames?.input,
          )}
          onChange={handleChange}
          onBlur={onBlur}
          {...textareaProps}
        />

        {suffixIcon && (
          <span className='pointer-events-none absolute right-3 top-3 text-gray-400'>
            <Icon name={suffixIcon} />
          </span>
        )}
      </div>
    </InputWrapper>
  )
}
