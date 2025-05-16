import { mergeAttributes, Node, VueNodeViewRenderer } from '@tiptap/vue-3'

import SvgBox from './svg-box.vue'

export default Node.create({
  name: 'SvgBox',

  group: 'block',
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      lines: {
        default: [],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'svg-box',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['svg-box', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(SvgBox)
  },
})