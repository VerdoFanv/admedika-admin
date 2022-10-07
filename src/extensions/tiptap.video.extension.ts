import { mergeAttributes, Node } from '@tiptap/core'

const Video = Node.create({
	name: `video`, // unique name for the Node
	group: `block`, // belongs to the 'block' group of extensions
	selectable: true, // so we can select the video
	draggable: true, // so we can drag the video
	atom: true, // is a single unit

	addAttributes() {
		return {
			"src": {
				default: null
			},
			"title": {
				default: null,
			},
			"frameborder": {
				default: `0`,
			},
			"allow": {
				default: `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`
			},
			"allowfullscreen": {
				default: `allowfullscreen`
			}
		}
	},

	parseHTML() {
		return [
			{
				tag: `iframe`,
			}
		]
	},

	renderHTML({ HTMLAttributes }) {
		return [ `iframe`, mergeAttributes(HTMLAttributes) ]
	},

	addNodeView() {
		return ({ editor, node }) => {
			const div = document.createElement(`div`)
			const iframe = document.createElement(`iframe`)
			div.className = `video`

			if (editor.isEditable) {
				iframe.className = `pointer-events-none`
			}
			iframe.width = `640`
			iframe.height = `360`
			iframe.frameBorder = `0`
			iframe.allowFullscreen = false
			iframe.src = node.attrs.src

			div.append(iframe)

			return {
				dom: div,
			}
		}
	},
})

export default Video