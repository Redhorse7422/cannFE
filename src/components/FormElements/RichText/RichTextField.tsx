'use client'

import type { ControllerProps } from '../Controller'

import React from 'react'

import clsx from 'clsx'

import { Controller } from '../Controller'
import { InputWrapper, type InputWrapperProps } from '../InputWrapper'

type RichTextInputProps = {
  name: string
  label?: string
  placeholder?: string
  className?: string
  classNames?: InputWrapperProps['classNames']
  labelAxis?: InputWrapperProps['labelAxis']
  labelWidth?: InputWrapperProps['labelWidth']
  width?: InputWrapperProps['width']
  size?: InputWrapperProps['size']
  helperText?: InputWrapperProps['helperText']
  disabledErrorMsg?: InputWrapperProps['disabledErrorMsg']
  isError?: InputWrapperProps['isError']
  errorMsg?: InputWrapperProps['errorMsg']
  freezeErrorSpace?: InputWrapperProps['freezeErrorSpace']
}

type RichTextFieldProps = RichTextInputProps & Pick<ControllerProps, 'control' | 'rules'>

const ToolbarButton: React.FC<{
  title: string
  onClick: () => void
  children: React.ReactNode
}> = ({ title, onClick, children }) => (
  <button
    type='button'
    title={title}
    onClick={onClick}
    className='rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50 active:bg-gray-100 dark:border-dark-3 dark:bg-dark-2'
  >
    {children}
  </button>
)

const RichTextInput: React.FC<
  RichTextInputProps & {
    value?: string
    onChange?: (next: string) => void
  }
> = ({
  label,
  placeholder,
  className,
  classNames,
  labelAxis,
  labelWidth,
  width,
  size = 'middle',
  helperText,
  disabledErrorMsg,
  isError,
  errorMsg,
  freezeErrorSpace,
  value,
  onChange,
}) => {
  const editorRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (editorRef.current && typeof value === 'string' && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  // Selection helpers
  const getSelectionRange = (): Range | null => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return null
    const range = selection.getRangeAt(0)
    if (!editorRef.current) return null
    // Ensure selection is within the editor
    if (!editorRef.current.contains(range.commonAncestorContainer)) return null
    return range
  }

  const replaceRangeWithNode = (range: Range, node: Node) => {
    range.deleteContents()
    range.insertNode(node)
  }

  const wrapRangeWithElement = (range: Range, element: HTMLElement) => {
    const contents = range.extractContents()
    element.appendChild(contents)
    range.insertNode(element)
  }

  const applyInline = (tagName: 'b' | 'i' | 'u' | 's') => {
    const range = getSelectionRange()
    if (!range || range.collapsed) return
    const el = document.createElement(tagName)
    wrapRangeWithElement(range, el)
    if (editorRef.current) onChange?.(editorRef.current.innerHTML)
  }

  const applyBlock = (tagName: 'h1' | 'h2' | 'p' | 'blockquote') => {
    const range = getSelectionRange()
    if (!range) return
    const el = document.createElement(tagName)
    // If nothing is selected, create an empty block
    if (range.collapsed) {
      el.textContent = ''
      replaceRangeWithNode(range, el)
    } else {
      wrapRangeWithElement(range, el)
    }
    if (editorRef.current) onChange?.(editorRef.current.innerHTML)
  }

  const applyList = (type: 'ul' | 'ol') => {
    const range = getSelectionRange()
    if (!range) return
    const text = range.toString()
    const lines = text.split(/\r?\n/).filter((l) => l.length > 0)
    const list = document.createElement(type)
    if (lines.length === 0) {
      const li = document.createElement('li')
      li.textContent = ''
      list.appendChild(li)
    } else {
      lines.forEach((line) => {
        const li = document.createElement('li')
        li.textContent = line
        list.appendChild(li)
      })
    }
    replaceRangeWithNode(range, list)
    if (editorRef.current) onChange?.(editorRef.current.innerHTML)
  }

  const applyLink = (href: string) => {
    const range = getSelectionRange()
    if (!range || range.collapsed) return
    const a = document.createElement('a')
    a.href = href
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    wrapRangeWithElement(range, a)
    if (editorRef.current) onChange?.(editorRef.current.innerHTML)
  }

  const clearFormatting = () => {
    const range = getSelectionRange()
    if (!range) return
    const textNode = document.createTextNode(range.toString())
    replaceRangeWithNode(range, textNode)
    if (editorRef.current) onChange?.(editorRef.current.innerHTML)
  }

  const sizeClasses = {
    small: 'text-sm',
    middle: 'text-base',
    large: 'text-lg',
  } as const

  return (
    <InputWrapper
      label={label}
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
      <div className='space-y-2'>
        <div className='flex flex-wrap gap-2'>
          <ToolbarButton title='Heading 1' onClick={() => applyBlock('h1')}>
            H1
          </ToolbarButton>
          <ToolbarButton title='Heading 2' onClick={() => applyBlock('h2')}>
            H2
          </ToolbarButton>
          <ToolbarButton title='Paragraph' onClick={() => applyBlock('p')}>
            P
          </ToolbarButton>
          <span className='mx-1 h-6 w-px self-center bg-gray-300' />
          <ToolbarButton title='Bold' onClick={() => applyInline('b')}>
            <b>B</b>
          </ToolbarButton>
          <ToolbarButton title='Italic' onClick={() => applyInline('i')}>
            <i>I</i>
          </ToolbarButton>
          <ToolbarButton title='Underline' onClick={() => applyInline('u')}>
            <u>U</u>
          </ToolbarButton>
          <ToolbarButton title='Strikethrough' onClick={() => applyInline('s')}>
            <s>S</s>
          </ToolbarButton>
          <span className='mx-1 h-6 w-px self-center bg-gray-300' />
          <ToolbarButton title='Bulleted list' onClick={() => applyList('ul')}>
            • List
          </ToolbarButton>
          <ToolbarButton title='Numbered list' onClick={() => applyList('ol')}>
            1. List
          </ToolbarButton>
          <ToolbarButton title='Quote' onClick={() => applyBlock('blockquote')}>
            &ldquo; &rdquo;
          </ToolbarButton>
          <ToolbarButton
            title='Link'
            onClick={() => {
              const url = prompt('Enter URL') || ''
              if (!url) return
              applyLink(url)
            }}
          >
            Link
          </ToolbarButton>
          <ToolbarButton title='Remove formatting' onClick={clearFormatting}>
            Clear
          </ToolbarButton>
        </div>

        <div
          ref={editorRef}
          contentEditable
          className={clsx(
            'min-h-[200px] w-full rounded-md border border-gray-300 bg-white p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary dark:border-dark-3 dark:bg-dark-2',
            sizeClasses[size],
          )}
          onInput={() => {
            if (editorRef.current) onChange?.(editorRef.current.innerHTML)
          }}
          onBlur={() => {
            if (editorRef.current) onChange?.(editorRef.current.innerHTML)
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        {!value && placeholder && (
          <div className='pointer-events-none -mt-[200px] ml-3 text-gray-400'>{placeholder}</div>
        )}
      </div>
    </InputWrapper>
  )
}

export const RichTextField: React.FC<RichTextFieldProps> = ({ control, rules, ...props }) => {
  return (
    <Controller control={control} name={props.name} rules={rules} Input={RichTextInput} inputProps={{ ...props }} />
  )
}

export default RichTextField
