import Color from "@tiptap/extension-color"
import ListItem from '@tiptap/extension-list-item'
import TextStyle from "@tiptap/extension-text-style"
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import IconFormatRedo from 'public/assets/icons/icon-format-redo.svg'
import IconFormatUndo from 'public/assets/icons/icon-format-undo.svg'
import { useEffect } from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	label?: string
	error?: any
}

export default function FormWysiwygColorPickerOnly({ setForm, error, name, label = `` }: Props) {
	const { watch, getValues, setValue } = setForm
	// remove <p> from inside of <li>
	const CustomListItem = ListItem.extend({
		name: `CleanListItem`,
		content: `text*`
	})

	const editor: Editor = useEditor({
		extensions: [
			StarterKit,
			TextStyle,
			Color,
			CustomListItem
		],
		content: ``
	})
	const html = editor?.getHTML()

	useEffect(() => {
		if (!editor || editor.isDestroyed) return

		if (!watch(name)) {
			editor.commands.setContent(``)
		}
	}, [ editor, watch(name) ])

	useEffect(() => {
		if (!editor || editor.isDestroyed) return

		editor.commands.setContent(getValues(name))
	}, [ editor, getValues, name ])

	useEffect(() => {
		if (!editor || editor.isDestroyed) return

		setValue(name, html)
	}, [ editor, setValue, name, html ])

	return (
		<div className="form-wysiwyg">
			<label className="form-wysiwyg-heading">{label}</label>
			<div className={`form-wysiwyg-field ${(getValues(name) === `<p></p>` && error) ? `is-error` : ``}`}>
				<div className="form-wysiwyg-menu">
					<MenuBar editorData={editor} />
				</div>
				<div className="form-wysiwyg-editor">
					<EditorContent editor={editor} />
				</div>
			</div>
			{error && getValues(name) === `<p></p>` &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}

function MenuBar({ editorData }) {
	const editor: Editor = editorData

	if (!editor) {
		return null
	}

	return (
		<>
			<div className="section">
				<input
					type="color"
					onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
					value={editor?.getAttributes(`textStyle`).color || `#ffffff`}
				/>

				<div className="divider"></div>

				<button type="button" title="Undo" onClick={() => editor.chain().focus().undo().run()}>
					<i className="icon" role="img"><IconFormatUndo className="svg" /></i>
				</button>

				<button type="button" title="Redo" onClick={() => editor.chain().focus().redo().run()}>
					<i className="icon" role="img"><IconFormatRedo className="svg" /></i>
				</button>
			</div>
		</>
	)
}
