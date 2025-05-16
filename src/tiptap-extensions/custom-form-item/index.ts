import { mergeAttributes, Node } from "@tiptap/core"
import { VueNodeViewRenderer } from "@tiptap/vue-3"

import VueComponent from "./custom-form-item.vue"

export default Node.create({
  name: "CustomFormItem",

  group: "inline",

  inline: true,

  atom: true,

  draggable: true,

  addAttributes() {
    return {
      type: "input"
    }
  },

  parseHTML() {
    return [
      {
        tag: "custom-form-item"
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["custom-form-item", mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(VueComponent)
  }
})
