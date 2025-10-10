'use client'

import type { ControllerProps } from '../Controller'

import React from 'react'

import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'

import { ReactIcon } from '@/components/common/icon/ReactIcon'

import { Controller } from '../Controller'
import { InputWrapper, type InputWrapperProps } from '../InputWrapper'

type TiptapInputProps = {
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
  freezeErrorSpace?: InputWrapperProps['freezeErrorSpace']
}

type TiptapFieldProps = TiptapInputProps & Pick<ControllerProps, 'control' | 'rules'>

const ToolbarButton: React.FC<{
  title: string
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
}> = ({ title, onClick, isActive, children }) => {
  return (
    <button
      type='button'
      title={title}
      onClick={onClick}
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-lg border transition-colors',
        isActive
          ? 'bg-blue-500 text-white border-blue-500'
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100',
      )}
    >
      {children}
    </button>
  )
}

const TiptapInput: React.FC<
  TiptapInputProps & {
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
  freezeErrorSpace,
  value,
  onChange,
}) => {
  const editor = useEditor({
    content: value || '',
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing something amazing...' }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none max-w-none w-full min-h-[300px] p-4',
      },
    },
    onUpdate({ editor: editor2 }) {
      onChange?.(editor2.getHTML())
    },
  })

  React.useEffect(() => {
    if (editor && typeof value === 'string' && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  return (
    <InputWrapper
      label={label}
      className={className}
      classNames={classNames}
      labelAxis={labelAxis}
      labelWidth={labelWidth}
      width={width}
      size={size}
      helperText={helperText}
      disabledErrorMsg={disabledErrorMsg}
      isError={isError}
      freezeErrorSpace={freezeErrorSpace}
    >
      <div className='flex w-full flex-col gap-0'>
        {!editor && <div className='rounded-xl border border-gray-300 p-3 text-sm text-gray-500'>Loading editor…</div>}
        {editor && (
          <div className='w-full rounded-t-xl border border-b-0 border-gray-300 bg-gray-50 p-3'>
            <div className='flex flex-wrap items-center gap-2'>
              <ToolbarButton
                title='Bold'
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
              >
                <ReactIcon.AiOutlineCheckCircle />
              </ToolbarButton>
              <ToolbarButton
                title='Italic'
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
              >
                <ReactIcon.AiOutlineCheck />
              </ToolbarButton>
              <ToolbarButton
                title='Strike'
                onClick={() => editor.chain().focus().toggleStrike().run()}
                isActive={editor.isActive('strike')}
              >
                <ReactIcon.AiOutlineClose />
              </ToolbarButton>
              <ToolbarButton
                title='H1'
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                isActive={editor.isActive('heading', { level: 1 })}
              >
                <span className='text-sm font-semibold'>H1</span>
              </ToolbarButton>
              <ToolbarButton
                title='H2'
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                isActive={editor.isActive('heading', { level: 2 })}
              >
                <span className='text-sm font-semibold'>H2</span>
              </ToolbarButton>
              <ToolbarButton
                title='H3'
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                isActive={editor.isActive('heading', { level: 3 })}
              >
                <span className='text-sm font-semibold'>H3</span>
              </ToolbarButton>
              <ToolbarButton
                title='Bullet List'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                isActive={editor.isActive('bulletList')}
              >
                <ReactIcon.AiOutlineMinus />
              </ToolbarButton>
              <ToolbarButton
                title='Ordered List'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                isActive={editor.isActive('orderedList')}
              >
                <ReactIcon.AiOutlinePlus />
              </ToolbarButton>
              <ToolbarButton
                title='Add Link'
                onClick={() => {
                  const url = window.prompt('Enter URL')
                  if (!url) return
                  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                }}
              >
                <ReactIcon.AiOutlineRight />
              </ToolbarButton>
              <ToolbarButton
                title='Remove Link'
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                <ReactIcon.AiOutlineLeft />
              </ToolbarButton>
              <ToolbarButton title='Undo' onClick={() => editor.chain().focus().undo().run()}>
                <ReactIcon.AiOutlineArrowLeft />
              </ToolbarButton>
              <ToolbarButton title='Redo' onClick={() => editor.chain().focus().redo().run()}>
                <ReactIcon.AiOutlineArrowRight />
              </ToolbarButton>
              <ToolbarButton
                title='Clear Formatting'
                onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              >
                <ReactIcon.AiOutlineCloseCircle />
              </ToolbarButton>
            </div>
          </div>
        )}
        {editor && (
          <div className='w-full rounded-b-xl border border-gray-300 bg-white'>
            <EditorContent editor={editor} className='w-full' />
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

export const TiptapField: React.FC<TiptapFieldProps> = ({ control, rules, ...props }) => {
  return <Controller control={control} name={props.name} rules={rules} Input={TiptapInput} inputProps={{ ...props }} />
}

export default TiptapField
