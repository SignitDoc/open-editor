import { mergeAttributes, Node } from "@tiptap/core"
import { VueNodeViewRenderer } from "@tiptap/vue-3"

import VueComponent from "./e-sign.vue"

export default Node.create({
  name: "ESign",

  group: "block",

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      count: {
        default: 0
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: "e-sign"
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["e-sign", mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(VueComponent)
  }
})
