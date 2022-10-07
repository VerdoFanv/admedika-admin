import { DashboardContext } from "@contexts/DashboardContext.context"
import Color from "@tiptap/extension-color"
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import ListItem from "@tiptap/extension-list-item"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TextStyle from "@tiptap/extension-text-style"
import TextAlign from "@tiptap/extension-text-align"
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { postData } from "@utils/fetcher"
import IconFormatBlockquote from 'public/assets/icons/icon-format-blockquote.svg'
import IconFormatBold from 'public/assets/icons/icon-format-bold.svg'
import IconFormatClear from 'public/assets/icons/icon-format-clear.svg'
import IconFormatH1 from 'public/assets/icons/icon-format-h1.svg'
import IconFormatH2 from 'public/assets/icons/icon-format-h2.svg'
import IconFormatH3 from 'public/assets/icons/icon-format-h3.svg'
import IconFormatHr from 'public/assets/icons/icon-format-hr.svg'
import IconFormatItalic from 'public/assets/icons/icon-format-italic.svg'
import IconFormatLinkOff from 'public/assets/icons/icon-format-link-off.svg'
import IconFormatLink from 'public/assets/icons/icon-format-link.svg'
import IconFormatListBulleted from 'public/assets/icons/icon-format-list-bulleted.svg'
import IconFormatListNumbered from 'public/assets/icons/icon-format-list-numbered.svg'
import IconFormatParagraph from 'public/assets/icons/icon-format-paragraph.svg'
import IconFormatRedo from 'public/assets/icons/icon-format-redo.svg'
import IconFormatStrikethrough from 'public/assets/icons/icon-format-strikethrough.svg'
import IconFormatUndo from 'public/assets/icons/icon-format-undo.svg'
import IconImage from 'public/assets/icons/icon-image.svg'
import IconTableBorderWidth from "public/assets/icons/icon-table-border-width.svg"
import IconTableCellMerge from "public/assets/icons/icon-table-cell-merge.svg"
import IconTableCellSplit from "public/assets/icons/icon-table-cell-split.svg"
import IconTableColumnPlusAfter from "public/assets/icons/icon-table-column-plus-after.svg"
import IconTableColumnPlusBefore from "public/assets/icons/icon-table-column-plus-before.svg"
import IconTableColumnRemove from "public/assets/icons/icon-table-column-remove.svg"
import IconTableHeaderRow from "public/assets/icons/icon-table-header-row.svg"
import IconTableRemove from 'public/assets/icons/icon-table-remove.svg'
import IconTableRowPlusAfter from "public/assets/icons/icon-table-row-plus-after.svg"
import IconTableRowPlusBefore from "public/assets/icons/icon-table-row-plus-before.svg"
import IconTableRowRemove from "public/assets/icons/icon-table-row-remove.svg"
import IconTable from 'public/assets/icons/icon-table.svg'
import IconYoutube from 'public/assets/icons/icon-youtube.svg'
import IconAlignLeft from 'public/assets/icons/icon-align-left.svg'
import IconAlignRight from 'public/assets/icons/icon-align-right.svg'
import IconAlignCenter from 'public/assets/icons/icon-align-center.svg'
import { useCallback, useContext, useEffect } from "react"
import { UseFormReturn, FieldValues } from "react-hook-form"
import Video from '../../extensions/tiptap.video.extension'

interface Props {
	setForm?: UseFormReturn<FieldValues, any>
	name: string
	label?: string
	error?: any
}

export default function FormWysiwyg({ error, setForm, name, label = `` }: Props) {
	const { watch, getValues, setValue } = setForm
	// remove <p> from inside of <li>
	const CustomListItem = ListItem.extend({
		name: `CleanListItem`,
		content: `text*`,
	})

	const CustomTable = Table.extend({
		addAttributes() {
			return {
				borderWidth: {
					default: `1`,
					renderHTML: (attr) => {
						return {
							style: `border-width: ${attr.borderWidth}px`
						}
					}
				}
			}
		}
	})

	const editor: Editor = useEditor({
		extensions: [
			StarterKit,
			TextStyle,
			Color,
			Image,
			CustomTable,
			CustomListItem,
			TableCell,
			TableHeader,
			TableRow,
			Video,
			TextAlign.configure({
				types: [ `heading`, `paragraph` ],
			}),
			Link.configure({
				openOnClick: false
			})
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
					<MenuBar editorData={editor} name={name} />
				</div>
				<div className="form-wysiwyg-editor">
					<EditorContent
						editor={editor}
					/>
				</div>
			</div>
			{error && getValues(name) === `<p></p>` &&
			<p className="form-input-error">{error.message}</p>
			}
		</div>
	)
}

function MenuBar({ editorData, name }) {
	const { dispatch } = useContext(DashboardContext)
	const editor: Editor = editorData

	const uploadImage = useCallback(async (file: File) => {
		let imageUrl: string

		dispatch({ type: `set_isLoading`, payload: true })

		try {
			const res = await postData(`/upload/store`, { file })

			imageUrl = res.data.file
		} catch (error) {
			dispatch({ type: `show_notification`, payload: {
				type: `error`,
				text: `Sorry, image cannot be uploaded!`,
				footnote: error.message
			} })
		}

		dispatch({ type: `set_isLoading`, payload: false })
		return imageUrl
	}, [ dispatch ])

	const addImage = useCallback((url: string) => {
		if (url) {
			editor.chain().focus().setImage({ src: url }).run()
		}
	}, [ editor ])

	const setLink = useCallback(() => {
		const previousUrl = editor.getAttributes(`link`).href
		const url = window.prompt(`URL`, previousUrl)

		if (url === null) {
			return
		}

		if (url === ``) {
			editor.chain().focus().extendMarkRange(`link`).unsetLink().run()
			return
		}

		editor.chain().focus().extendMarkRange(`link`).setLink({ href: url }).run()
	}, [ editor ])

	const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e?.target?.files?.[0]) return
		uploadImage(e.target.files[0])
			.then((res) => addImage(res))
			.catch((err) => console.error(err))
	}, [ uploadImage, addImage ])

	const setVideo = useCallback(() => {
		const videoSrc = editor.getAttributes(`video`).src
		const videoInput = window.prompt(`Youtube/Vimeo URL`, videoSrc)

		// cancelled
		if (videoInput === null) {
			return
		}

		// empty
		if (videoInput === ``) {
			if (editor.isActive(`video`)) {
				editor.commands.deleteSelection()
			} else {
				return false
			}
		}

		// update video
		// validate url is from youtube or vimeo
		if (!videoInput.match(/youtube|vimeo/)) {
			return alert(`Sorry, your video must be hosted on YouTube or Vimeo.`)
		}
		const srcCheck = videoInput.match(/src="(?<src>.+?)"/) // get the src value from embed code if all pasted in
		const src = srcCheck ? srcCheck.groups.src : videoInput // use src or if just url in input use that
		// check youtube url is correct
		if (videoInput.match(/youtube/) && !src.match(/^https:\/\/www\.youtube\.com\/embed\//)) {
			return alert(`Sorry, your YouTube embed URL should start with https://www.youtube.com/embed/ to work.`)
		}
		// check vimeo url is correct
		if (videoInput.match(/vimeo/) && !src.match(/^https:\/\/player\.vimeo\.com\/video\//)) {
			return alert(`Sorry, your Vimeo embed URL should start with https://player.vimeo.com/video/ to work.`)
		}
		if (videoInput) {
			editor.chain().focus().insertContent(`<iframe src="${src}"></iframe>`).run() // add a new video element
		} else {
			editor.commands.updateAttributes(`iframe`, { src: src }) // update the current video src
		}

	}, [ editor ])

	const setTable = useCallback(() => {
		const	tableBorderWidth = editor.getAttributes(`table`).borderWidth
		const borderWidthInput = window.prompt(`Border Width`, tableBorderWidth)
		const input = Number(borderWidthInput)

		if (isNaN(input)) {
			return alert(`Please input number.`)
		} else {
			if (input !== 0) {
				editor.commands.updateAttributes(`table`, { borderWidth: input })
			}
		}
	}, [ editor ])

	if (!editor) {
		return null
	}

	return (
		<>
			<div className="section">
				<button
					type="button"
					title="Bold"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={editor.isActive(`bold`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatBold className="svg" /></i>
				</button>

				<button
					type="button"
					title="Italic"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={editor.isActive(`italic`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatItalic className="svg" /></i>
				</button>

				<button
					type="button"
					title="Strike"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					className={editor.isActive(`strike`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatStrikethrough className="svg" /></i>
				</button>

				<button type="button" title="Clear Formatting" onClick={() => editor.chain().focus().unsetAllMarks().run()}>
					<i className="icon" role="img"><IconFormatClear className="svg" /></i>
				</button>

				<input
					type="color"
					onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
					value={editor.getAttributes(`textStyle`).color || `#ffffff`}
				/>

				<div className="divider"></div>

				<button
					type="button"
					title="Paragraph"
					onClick={() => editor.chain().focus().setParagraph().run()}
					className={editor.isActive(`paragraph`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatParagraph className="svg" /></i>
				</button>

				<button
					type="button"
					title="Heading 1"
					onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					className={editor.isActive(`heading`, { level: 1 }) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatH1 className="svg" /></i>
				</button>

				<button
					type="button"
					title="Heading 2"
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					className={editor.isActive(`heading`, { level: 2 }) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatH2 className="svg" /></i>
				</button>

				<button
					type="button"
					title="Heading 3"
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					className={editor.isActive(`heading`, { level: 3 }) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatH3 className="svg" /></i>
				</button>

				<button
					type="button"
					title="Bullet List"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={editor.isActive(`bulletList`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatListBulleted className="svg" /></i>
				</button>

				<button
					type="button"
					title="Ordered List"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={editor.isActive(`orderedList`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatListNumbered className="svg" /></i>
				</button>

				<div className="divider"></div>

				<button
					type="button"
					title="Align Left"
					onClick={() => editor.chain().focus().setTextAlign(`left`).run()}
					className={editor.isActive({ textAlign: `left` }) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconAlignLeft className="svg" /></i>
				</button>
				<button
					type="button"
					title="Align Center"
					onClick={() => editor.chain().focus().setTextAlign(`center`).run()}
					className={editor.isActive({ textAlign: `center` }) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconAlignCenter className="svg" /></i>
				</button>
				<button
					type="button"
					title="Align Right"
					onClick={() => editor.chain().focus().setTextAlign(`right`).run()}
					className={editor.isActive({ textAlign: `right` }) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconAlignRight className="svg" /></i>
				</button>

				<div className="divider"></div>

				<button
					type="button"
					title="Add Link"
					onClick={setLink}
					className={editor.isActive(`link`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatLink className="svg" /></i>
				</button>

				<button
					type="button"
					title="Remove Link"
					onClick={() => editor.chain().focus().unsetLink().run()}
					disabled={!editor.isActive(`link`)}
				>
					<i className="icon" role="img"><IconFormatLinkOff className="svg" /></i>
				</button>

				<label htmlFor={`${name}-image-upload`}>
					<span className="button" title="Image">
						<i className="icon" role="img"><IconImage className="svg" /></i>
					</span>
					<input type="file" onChange={handleImageChange} id={`${name}-image-upload`} className="is-hidden" />
				</label>

				<button
					type="button"
					title="Video"
					onClick={setVideo}
					className={editor.isActive(`video`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconYoutube className="svg" /></i>
				</button>

				<button
					type="button"
					title="Blockquote"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={editor.isActive(`blockquote`) ? `is-active` : ``}
				>
					<i className="icon" role="img"><IconFormatBlockquote className="svg" /></i>
				</button>

				<button type="button" title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
					<i className="icon" role="img"><IconFormatHr className="svg" /></i>
				</button>

				<div className="divider"></div>

				<button type="button" title="Undo" onClick={() => editor.chain().focus().undo().run()}>
					<i className="icon" role="img"><IconFormatUndo className="svg" /></i>
				</button>

				<button type="button" title="Redo" onClick={() => editor.chain().focus().redo().run()}>
					<i className="icon" role="img"><IconFormatRedo className="svg" /></i>
				</button>
			</div>
			<div className="section">
				<button
					type="button"
					title="Insert Table"
					onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
				>
					<i className="icon" role="img"><IconTable className="svg" /></i>
				</button>

				<button
					type="button"
					title="Remove Table"
					onClick={() => editor.chain().focus().deleteTable().run()}
					disabled={!editor.can().deleteTable()}
				>
					<i className="icon" role="img"><IconTableRemove className="svg" /></i>
				</button>

				<button type="button" title="Set Border Width" onClick={setTable} disabled={!editor.can().toggleHeaderRow()}>
					<i className="icon" role="img"><IconTableBorderWidth className="svg" /></i>
				</button>

				<button type="button" title="Toggle Header" onClick={() => editor.chain().focus().toggleHeaderRow().run()} disabled={!editor.can().toggleHeaderRow()}>
					<i className="icon" role="img"><IconTableHeaderRow className="svg" /></i>
				</button>

				<button type="button" title="Add Column Before" onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!editor.can().addColumnBefore()}>
					<i className="icon" role="img"><IconTableColumnPlusBefore className="svg" /></i>
				</button>
				<button type="button" title="Add Column After" onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!editor.can().addColumnAfter()}>
					<i className="icon" role="img"><IconTableColumnPlusAfter className="svg" /></i>
				</button>

				<button type="button" title="Remove Column" onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!editor.can().deleteColumn()}>
					<i className="icon" role="img"><IconTableColumnRemove className="svg" /></i>
				</button>

				<button type="button" title="Add Row Before" onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!editor.can().addRowBefore()}>
					<i className="icon" role="img"><IconTableRowPlusBefore className="svg" /></i>
				</button>

				<button type="button" title="Add Row After" onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!editor.can().addRowAfter()}>
					<i className="icon" role="img"><IconTableRowPlusAfter className="svg" /></i>
				</button>

				<button type="button" title="Remove Row" onClick={() => editor.chain().focus().deleteRow().run()} disabled={!editor.can().deleteRow()}>
					<i className="icon" role="img"><IconTableRowRemove className="svg" /></i>
				</button>

				<button type="button" title="Merge Cells" onClick={() => editor.chain().focus().mergeCells().run()} disabled={!editor.can().mergeCells()}>
					<i className="icon" role="img"><IconTableCellMerge className="svg" /></i>
				</button>

				<button type="button" title="Split Cell" onClick={() => editor.chain().focus().splitCell().run()} disabled={!editor.can().splitCell()}>
					<i className="icon" role="img"><IconTableCellSplit className="svg" /></i>
				</button>
			</div>
		</>
	)
}