import { mergeAttributes, Node } from "@tiptap/core"
import { VueNodeViewRenderer } from "@tiptap/vue-3"

import Component from "./draggable-item.vue"

/* 使用时：
insertContent({ 
  type: 'DraggableItem', 
  content: [ //content：可移动对象
    {
      type: 'paragraph', //type：需要插入block类型的元素
      content: [{ type: 'text', text: '123'}] //inline类型元素不可以直接插入，借助嵌套转换
    }
  ], 
})
*/

export default Node.create({
  name: "DraggableItem",

  group: "block",

  content: "block*",

  draggable: true,
  addAttributes() {
    return {
      background: {
        default: "#fdf6ec"
      },
      borderColor: {
        default: "#f3d19e"
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-item"]'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "draggable-item" }), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  }
})
