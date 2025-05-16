import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight"
import CodeBlockComponent from "./code-block.vue"
import { VueNodeViewRenderer } from "@tiptap/vue-3"

const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(CodeBlockComponent)
  }
})

export default CodeBlock
