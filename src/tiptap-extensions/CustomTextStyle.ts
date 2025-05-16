import { mergeAttributes } from "@tiptap/core"
// TextStyle 解决span中background失效的问题
import TextStyle from "@tiptap/extension-text-style"

const CustomTextStyle = TextStyle.extend({
  addAttributes() {
    return {
      background: {
        parseHTML: element => {
          if (element.style.backgroundColor || element.style.background)
            return `${element.style.backgroundColor || element.style.background}`
        }
      }
    }
  },
  renderHTML({ HTMLAttributes }) {
    if (HTMLAttributes.background) {
      const attrsString = HTMLAttributes.style?.split(";") || []
      attrsString.push(`background:${HTMLAttributes.background}`)
      HTMLAttributes.style = attrsString.join(";")
    }
    return ["span", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  }
})

export default CustomTextStyle
