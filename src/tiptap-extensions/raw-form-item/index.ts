import { mergeAttributes, Node } from "@tiptap/core"
import { VueNodeViewRenderer } from "@tiptap/vue-3"

import VueComponent from "./raw-form-item.vue"

export default Node.create({
  name: "RawFormItem",

  group: "inline",

  inline: true,

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      type: "input",
      options: []
    }
  },

  parseHTML() {
    return [
      {
        tag: "raw-form-item"
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["raw-form-item", mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(VueComponent)
  }
})
